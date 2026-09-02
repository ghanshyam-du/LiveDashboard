import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FuelType } from '../../common/enums';

export type VehicleDocument = Vehicle & Document;

@Schema({ timestamps: true, collection: 'vehicles' })
export class Vehicle {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true, index: true })
  customer: Types.ObjectId;

  @Prop({ required: true, trim: true })
  make: string;

  @Prop({ required: true, trim: true })
  model: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, uppercase: true, trim: true })
  registrationNumber: string;

  @Prop({ trim: true })
  color: string;

  @Prop({ enum: FuelType, default: FuelType.PETROL })
  fuelType: FuelType;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
