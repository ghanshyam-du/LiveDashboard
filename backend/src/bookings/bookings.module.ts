import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking, BookingSchema } from './schemas/booking.schema';
import { Customer, CustomerSchema } from '../customers/schemas/customer.schema';
import { Vehicle, VehicleSchema } from '../vehicles/schemas/vehicle.schema';
import { Service, ServiceSchema } from '../services/schemas/service.schema';
import { Mechanic, MechanicSchema } from '../mechanics/schemas/mechanic.schema';
import { Notification, NotificationSchema } from '../notifications/schemas/notification.schema';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: Service.name, schema: ServiceSchema },
      { name: Mechanic.name, schema: MechanicSchema },
      { name: Notification.name, schema: NotificationSchema },
    ]),
    GatewayModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
