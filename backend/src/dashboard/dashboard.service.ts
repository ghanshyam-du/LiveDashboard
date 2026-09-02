import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { Customer, CustomerDocument } from '../customers/schemas/customer.schema';
import { Mechanic, MechanicDocument } from '../mechanics/schemas/mechanic.schema';
import { BookingStatus, MechanicStatus } from '../common/enums';

type AnalyticsPeriod = '7d' | '30d' | '90d';

const PERIOD_DAYS: Record<AnalyticsPeriod, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>,
    @InjectModel(Mechanic.name) private readonly mechanicModel: Model<MechanicDocument>,
  ) {}

  /**
   * Returns KPI summary cards data.
   * All calculations happen in MongoDB — nothing computed in the browser.
   */
  async getSummary() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalBookings,
      todaysBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      revenueResult,
      activeMechanics,
      newCustomersToday,
    ] = await Promise.all([
      this.bookingModel.countDocuments(),
      this.bookingModel.countDocuments({ scheduledAt: { $gte: todayStart } }),
      this.bookingModel.countDocuments({ status: BookingStatus.COMPLETED }),
      this.bookingModel.countDocuments({ status: BookingStatus.PENDING }),
      this.bookingModel.countDocuments({ status: BookingStatus.CANCELLED }),
      this.bookingModel.aggregate([
        { $match: { status: BookingStatus.COMPLETED } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.mechanicModel.countDocuments({
        isActive: true,
        currentStatus: { $ne: MechanicStatus.OFFLINE },
      }),
      this.customerModel.countDocuments({ createdAt: { $gte: todayStart } }),
    ]);

    const totalRevenue = revenueResult[0]?.total ?? 0;

    return {
      totalBookings,
      todaysBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      totalRevenue,
      activeMechanics,
      newCustomersToday,
    };
  }

  /**
   * Returns all chart data for the given period.
   * Uses MongoDB aggregation pipelines — not computed in JS.
   */
  async getAnalytics(period: AnalyticsPeriod = '30d') {
    const days = PERIOD_DAYS[period] ?? 30;
    const periodStart = new Date();
    periodStart.setDate(periodStart.getDate() - days);
    periodStart.setHours(0, 0, 0, 0);

    const [
      bookingTrend,
      revenueTrend,
      bookingStatusDistribution,
      serviceBreakdown,
    ] = await Promise.all([
      this.getBookingTrend(periodStart),
      this.getRevenueTrend(periodStart),
      this.getBookingStatusDistribution(),
      this.getServiceBreakdown(),
    ]);

    return {
      period,
      bookingTrend,
      revenueTrend,
      bookingStatusDistribution,
      serviceBreakdown,
    };
  }

  /** Daily booking count for the chart */
  private async getBookingTrend(since: Date) {
    return this.bookingModel.aggregate([
      { $match: { scheduledAt: { $gte: since } } },
      {
        $group: {
          _id: {
            year: { $year: '$scheduledAt' },
            month: { $month: '$scheduledAt' },
            day: { $dayOfMonth: '$scheduledAt' },
          },
          bookings: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          bookings: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);
  }

  /** Daily completed-booking revenue for the chart */
  private async getRevenueTrend(since: Date) {
    return this.bookingModel.aggregate([
      { $match: { scheduledAt: { $gte: since }, status: BookingStatus.COMPLETED } },
      {
        $group: {
          _id: {
            year: { $year: '$scheduledAt' },
            month: { $month: '$scheduledAt' },
            day: { $dayOfMonth: '$scheduledAt' },
          },
          revenue: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: '$_id.day',
            },
          },
          revenue: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);
  }

  /** Distribution of each booking status — for doughnut/pie chart */
  private async getBookingStatusDistribution() {
    const results = await this.bookingModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    return results.map((r) => ({ status: r._id, count: r.count }));
  }

  /** Booking count grouped by service name — for bar/pie chart */
  private async getServiceBreakdown() {
    return this.bookingModel.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceInfo',
        },
      },
      { $unwind: '$serviceInfo' },
      {
        $group: {
          _id: '$serviceInfo.name',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $project: { _id: 0, service: '$_id', count: 1, revenue: 1 } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
  }
}
