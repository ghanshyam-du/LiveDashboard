import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { DashboardModule } from './dashboard/dashboard.module';
import { BookingsModule } from './bookings/bookings.module';
import { MechanicsModule } from './mechanics/mechanics.module';
import { CustomersModule } from './customers/customers.module';
import { ServicesModule } from './services/services.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    // Load .env before everything else
    ConfigModule.forRoot({ isGlobal: true }),

    // MongoDB connection driven by env variable
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Basic rate limiting — 100 requests per 60 seconds per IP
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    // Feature modules
    GatewayModule,
    DashboardModule,
    BookingsModule,
    MechanicsModule,
    CustomersModule,
    ServicesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
