import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { Mechanic, MechanicSchema } from '../mechanics/schemas/mechanic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Mechanic.name, schema: MechanicSchema },
    ]),
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
