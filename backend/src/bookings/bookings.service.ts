import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { Mechanic, MechanicDocument } from '../mechanics/schemas/mechanic.schema';
import { Notification, NotificationDocument } from '../notifications/schemas/notification.schema';
import { EventsGateway } from '../gateway/events.gateway';
import { GetBookingsQueryDto } from './dto/get-bookings-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import {
  BookingStatus,
  MechanicStatus,
  NotificationType,
  VALID_BOOKING_STATUS_TRANSITIONS,
} from '../common/enums';

/** Constant for valid sortable fields to prevent injection via sortBy param */
const ALLOWED_SORT_FIELDS = new Set(['scheduledAt', 'createdAt', 'amount', 'status']);

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Mechanic.name) private readonly mechanicModel: Model<MechanicDocument>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAll(query: GetBookingsQueryDto) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      mechanicId,
      serviceId,
      from,
      to,
      sortBy = 'scheduledAt',
      sortOrder = 'desc',
    } = query;

    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    }

    if (mechanicId && Types.ObjectId.isValid(mechanicId)) {
      filter.mechanic = new Types.ObjectId(mechanicId);
    }

    if (serviceId && Types.ObjectId.isValid(serviceId)) {
      filter.service = new Types.ObjectId(serviceId);
    }

    if (from || to) {
      filter.scheduledAt = {};
      if (from) (filter.scheduledAt as Record<string, Date>)['$gte'] = new Date(from);
      if (to) (filter.scheduledAt as Record<string, Date>)['$lte'] = new Date(to);
    }

    // Text-based search across bookingNumber (exact) — customer/mechanic search
    // is done post-lookup via populate + match in application layer for simplicity
    if (search) {
      filter['$or'] = [
        { bookingNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const safeSortField = ALLOWED_SORT_FIELDS.has(sortBy) ? sortBy : 'scheduledAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const total = await this.bookingModel.countDocuments(filter);

    const bookings = await this.bookingModel
      .find(filter)
      .populate('customer', 'name email phone')
      .populate('vehicle', 'make model year registrationNumber')
      .populate('service', 'name category')
      .populate('mechanic', 'name currentStatus')
      .sort({ [safeSortField]: sortDirection })
      .skip(skip)
      .limit(limit)
      .lean();

    // If search was provided, additionally filter by customer/mechanic name in memory
    // This is acceptable because the result set after DB filter is small (1 page)
    const filteredBookings = search
      ? bookings.filter((booking) => {
          const customerName = (booking.customer as any)?.name?.toLowerCase() ?? '';
          const mechanicName = (booking.mechanic as any)?.name?.toLowerCase() ?? '';
          const vehicleReg = (booking.vehicle as any)?.registrationNumber?.toLowerCase() ?? '';
          const term = search.toLowerCase();
          return (
            booking.bookingNumber.toLowerCase().includes(term) ||
            customerName.includes(term) ||
            mechanicName.includes(term) ||
            vehicleReg.includes(term)
          );
        })
      : bookings;

    return {
      data: filteredBookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<BookingDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid booking ID: ${id}`);
    }

    const booking = await this.bookingModel
      .findById(id)
      .populate('customer', 'name email phone address')
      .populate('vehicle', 'make model year registrationNumber color fuelType')
      .populate('service', 'name category description estimatedDurationMinutes')
      .populate('mechanic', 'name email phone currentStatus rating');

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    return booking;
  }

  async updateBookingStatus(
    id: string,
    updateDto: UpdateBookingStatusDto,
  ): Promise<BookingDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid booking ID: ${id}`);
    }

    const booking = await this.bookingModel
      .findById(id)
      .populate('mechanic', 'name');

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }

    const { status: newStatus, notes, cancellationReason } = updateDto;
    const currentStatus = booking.status;

    // Enforce state machine rules
    this.validateStatusTransition(currentStatus, newStatus);

    // Update status and relevant timestamps
    booking.status = newStatus;

    if (newStatus === BookingStatus.COMPLETED) {
      booking.completedAt = new Date();
    }

    if (newStatus === BookingStatus.CANCELLED) {
      booking.cancelledAt = new Date();
      if (cancellationReason) {
        booking.cancellationReason = cancellationReason;
      }
    }

    // Append to audit trail
    booking.statusHistory.push({
      status: newStatus,
      changedAt: new Date(),
      notes: notes ?? '',
    });

    await booking.save();

    // Update mechanic availability when booking is completed or cancelled
    if (booking.mechanic) {
      const mechanic = await this.mechanicModel.findById(booking.mechanic);
      if (mechanic) {
        if (newStatus === BookingStatus.COMPLETED) {
          mechanic.currentStatus = MechanicStatus.AVAILABLE;
          mechanic.totalJobsCompleted += 1;
        } else if (newStatus === BookingStatus.CANCELLED) {
          mechanic.currentStatus = MechanicStatus.AVAILABLE;
        } else if (newStatus === BookingStatus.MECHANIC_ON_THE_WAY) {
          mechanic.currentStatus = MechanicStatus.ON_THE_WAY;
        }
        await mechanic.save();
      }
    }

    // Create notification record
    const notificationTitle = this.buildNotificationTitle(newStatus, booking.bookingNumber);
    const notificationMessage = this.buildNotificationMessage(
      newStatus,
      booking.bookingNumber,
      (booking.mechanic as any)?.name,
    );

    const notification = await this.notificationModel.create({
      type: NotificationType.BOOKING_STATUS_UPDATED,
      title: notificationTitle,
      message: notificationMessage,
      referenceId: booking._id,
      referenceType: 'Booking',
    });

    // Emit real-time events AFTER database update succeeds
    this.eventsGateway.emitBookingStatusUpdated({
      bookingId: booking._id.toString(),
      bookingNumber: booking.bookingNumber,
      newStatus,
      mechanicId: booking.mechanic?.toString(),
      mechanicName: (booking.mechanic as any)?.name,
    });

    this.eventsGateway.emitNewNotification(notification.toObject() as unknown as Record<string, unknown>);
    this.eventsGateway.emitDashboardStatsUpdated();

    return this.findById(id);
  }

  /** Validates a status transition against the state machine. Throws if invalid. */
  private validateStatusTransition(from: BookingStatus, to: BookingStatus): void {
    const allowedNextStatuses = VALID_BOOKING_STATUS_TRANSITIONS[from];

    if (!allowedNextStatuses.includes(to)) {
      throw new BadRequestException(
        `Cannot transition booking from ${from} to ${to}. ` +
          `Allowed transitions: ${allowedNextStatuses.join(', ') || 'none (terminal state)'}`,
      );
    }
  }

  private buildNotificationTitle(status: BookingStatus, bookingNumber: string): string {
    const titles: Record<BookingStatus, string> = {
      [BookingStatus.PENDING]: `New Booking ${bookingNumber}`,
      [BookingStatus.ASSIGNED]: `Booking ${bookingNumber} Assigned`,
      [BookingStatus.MECHANIC_ON_THE_WAY]: `Mechanic On The Way — ${bookingNumber}`,
      [BookingStatus.COMPLETED]: `Booking ${bookingNumber} Completed`,
      [BookingStatus.CANCELLED]: `Booking ${bookingNumber} Cancelled`,
    };
    return titles[status];
  }

  private buildNotificationMessage(
    status: BookingStatus,
    bookingNumber: string,
    mechanicName?: string,
  ): string {
    switch (status) {
      case BookingStatus.ASSIGNED:
        return mechanicName
          ? `${bookingNumber} has been assigned to mechanic ${mechanicName}.`
          : `${bookingNumber} has been assigned.`;
      case BookingStatus.MECHANIC_ON_THE_WAY:
        return `Mechanic ${mechanicName ?? ''} is on the way for booking ${bookingNumber}.`;
      case BookingStatus.COMPLETED:
        return `Booking ${bookingNumber} has been completed successfully.`;
      case BookingStatus.CANCELLED:
        return `Booking ${bookingNumber} has been cancelled.`;
      default:
        return `Booking ${bookingNumber} status updated to ${status}.`;
    }
  }
}
