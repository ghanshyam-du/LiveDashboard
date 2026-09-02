import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MechanicsController } from './mechanics.controller';
import { MechanicsService } from './mechanics.service';
import { Mechanic, MechanicSchema } from './schemas/mechanic.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Mechanic.name, schema: MechanicSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Vehicle.name, schema: VehicleSchema },
    ]),
    GatewayModule,
  ],
  controllers: [MechanicsController],
  providers: [MechanicsService],
  exports: [MechanicsService],
})
export class MechanicsModule {}
