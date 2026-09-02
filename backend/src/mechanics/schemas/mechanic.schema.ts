import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { MechanicStatus } from '../../common/enums';

export type MechanicDocument = Mechanic & Document;

@Schema({ timestamps: true, collection: 'mechanics' })
export class Mechanic {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: [String], default: [] })
  specializations: string[];

  @Prop({ enum: MechanicStatus, default: MechanicStatus.AVAILABLE, index: true })
  currentStatus: MechanicStatus;

  @Prop({ default: 0 })
  totalJobsCompleted: number;

  @Prop({ min: 1, max: 5, default: 4.0 })
  rating: number;

  @Prop({ default: 1 })
  yearsOfExperience: number;

  @Prop({ default: true, index: true })
  isActive: boolean;
}

export const MechanicSchema = SchemaFactory.createForClass(Mechanic);
