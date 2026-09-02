import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service, ServiceDocument } from './schemas/service.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private readonly serviceModel: Model<ServiceDocument>,
  ) {}

  async findAll(): Promise<ServiceDocument[]> {
    return this.serviceModel.find({ isActive: true }).sort({ name: 1 }).lean() as unknown as ServiceDocument[];
  }
}
