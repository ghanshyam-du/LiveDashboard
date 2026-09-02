import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true, collection: 'services' })
export class Service {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true, min: 0 })
  basePrice: number;

  @Prop({ required: true, min: 0 })
  estimatedDurationMinutes: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
