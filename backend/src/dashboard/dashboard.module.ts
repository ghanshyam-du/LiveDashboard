import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Mechanic, MechanicSchema } from '../mechanics/schemas/mechanic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Mechanic.name, schema: MechanicSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
