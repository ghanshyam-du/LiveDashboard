import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { NotificationType } from '../../common/enums';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true, collection: 'notifications' })
export class Notification {
  @Prop({ enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Types.ObjectId })
  referenceId?: Types.ObjectId;

  @Prop()
  referenceType?: string;

  @Prop({ default: false, index: true })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// TTL index: auto-delete notifications older than 30 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });
