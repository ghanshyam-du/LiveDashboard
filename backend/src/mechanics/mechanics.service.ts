import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Mechanic, MechanicDocument } from './schemas/mechanic.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { EventsGateway } from '../gateway/events.gateway';
import { GetMechanicsQueryDto } from './dto/get-mechanics-query.dto';
import { UpdateMechanicStatusDto } from './dto/update-mechanic-status.dto';
import { MechanicStatus } from '../common/enums';

@Injectable()
export class MechanicsService {
  constructor(
    @InjectModel(Mechanic.name) private readonly mechanicModel: Model<MechanicDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async findAll(query: GetMechanicsQueryDto) {
    const { page = 1, limit = 20, search, status } = query;

    const filter: Record<string, unknown> = { isActive: true };

    if (status) {
      filter.currentStatus = status;
    }

    if (search) {
      filter['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await this.mechanicModel.countDocuments(filter);

    const mechanics = await this.mechanicModel
      .find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return {
      data: mechanics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<MechanicDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid mechanic ID: ${id}`);
    }

    const mechanic = await this.mechanicModel.findById(id);
    if (!mechanic) {
      throw new NotFoundException(`Mechanic with ID ${id} not found`);
    }

    return mechanic;
  }

  async getMechanicWithRecentBookings(id: string) {
    const mechanic = await this.findById(id);

    const recentBookings = await this.bookingModel
      .find({ mechanic: new Types.ObjectId(id) })
      .populate('customer', 'name')
      .populate('service', 'name')
      .populate('vehicle', 'make model')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return {
      mechanic,
      recentBookings,
    };
  }

  async updateStatus(
    id: string,
    updateDto: UpdateMechanicStatusDto,
  ): Promise<MechanicDocument> {
    const mechanic = await this.findById(id);
    mechanic.currentStatus = updateDto.status;
    await mechanic.save();

    this.eventsGateway.emitMechanicStatusUpdated({
      mechanicId: id,
      mechanicName: mechanic.name,
      newStatus: updateDto.status as MechanicStatus,
    });

    return mechanic;
  }
}
