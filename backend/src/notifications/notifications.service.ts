import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async findAll(limit = 20, isRead?: boolean) {
    const filter: Record<string, unknown> = {};
    if (isRead !== undefined) {
      filter.isRead = isRead;
    }

    const notifications = await this.notificationModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return { data: notifications };
  }

  async markAsRead(id: string): Promise<NotificationDocument> {
    return this.notificationModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { isRead: true },
      { new: true },
    );
  }

  async markAllAsRead(): Promise<void> {
    await this.notificationModel.updateMany({ isRead: false }, { isRead: true });
  }

  async getUnreadCount(): Promise<number> {
    return this.notificationModel.countDocuments({ isRead: false });
  }
}
