import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { BookingStatus } from '../../common/enums';

/** Embedded sub-document to record every status change for audit trail */
class StatusHistoryEntry {
  @Prop({ enum: BookingStatus, required: true })
  status: BookingStatus;

  @Prop({ required: true })
  changedAt: Date;

  @Prop()
  notes: string;
}

export type BookingDocument = Booking & Document;

@Schema({ timestamps: true, collection: 'bookings' })
export class Booking {
  @Prop({ required: true, unique: true, trim: true, index: true })
  bookingNumber: string; // e.g. BK-00042

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true, index: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Service', required: true, index: true })
  service: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Mechanic', index: true })
  mechanic?: Types.ObjectId;

  @Prop({ enum: BookingStatus, default: BookingStatus.PENDING, index: true })
  status: BookingStatus;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ trim: true })
  notes: string;

  @Prop({ required: true, index: true })
  scheduledAt: Date;

  @Prop()
  completedAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop({ trim: true })
  cancellationReason?: string;

  @Prop({ type: [Object], default: [] })
  statusHistory: StatusHistoryEntry[];
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

// Compound index for common analytics queries
BookingSchema.index({ status: 1, scheduledAt: -1 });
BookingSchema.index({ customer: 1, createdAt: -1 });
