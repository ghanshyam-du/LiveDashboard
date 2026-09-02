import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({ required: true, trim: true, index: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ trim: true })
  address: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
