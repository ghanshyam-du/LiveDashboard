import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { GetCustomersQueryDto } from './dto/get-customers-query.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
  ) {}

  async findAll(query: GetCustomersQueryDto): Promise<{
    data: any[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { page = 1, limit = 20, search } = query;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await this.customerModel.countDocuments(filter);

    const customers = await this.customerModel
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Attach aggregated booking stats for each customer in this page
    const customerIds = customers.map((c) => c._id);

    const bookingStats = await this.bookingModel.aggregate([
      { $match: { customer: { $in: customerIds } } },
      {
        $group: {
          _id: '$customer',
          totalBookings: { $sum: 1 },
          totalAmountSpent: { $sum: '$amount' },
          lastBookingDate: { $max: '$scheduledAt' },
        },
      },
    ]);

    const statsById = new Map(bookingStats.map((s) => [s._id.toString(), s]));

    const enrichedCustomers = customers.map((customer) => {
      const stats = statsById.get(customer._id.toString());
      return {
        ...customer,
        totalBookings: stats?.totalBookings ?? 0,
        totalAmountSpent: stats?.totalAmountSpent ?? 0,
        lastBookingDate: stats?.lastBookingDate ?? null,
      };
    });

    return {
      data: enrichedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid customer ID: ${id}`);
    }

    const customer = await this.customerModel.findById(id).lean();
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const recentBookings = await this.bookingModel
      .find({ customer: new Types.ObjectId(id) })
      .populate('service', 'name category')
      .populate('vehicle', 'make model year')
      .populate('mechanic', 'name')
      .sort({ scheduledAt: -1 })
      .limit(10)
      .lean();

    const [stats] = await this.bookingModel.aggregate([
      { $match: { customer: new Types.ObjectId(id) } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalAmountSpent: { $sum: '$amount' },
        },
      },
    ]);

    return {
      customer,
      recentBookings,
      totalBookings: stats?.totalBookings ?? 0,
      totalAmountSpent: stats?.totalAmountSpent ?? 0,
    };
  }
}
