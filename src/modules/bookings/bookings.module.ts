import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';
import { BookingsService } from './bookings.service';
import { BookingsResolver } from './bookings.resolver';
import { AuthModule } from '../auth/auth.module';
import { Passenger } from '../passengers/passengers.entity';
import { Flight } from '../flights/flights.entity';
import { Baggage } from '../baggage/baggage.entity';
import { Notification } from '../notifications/notifications.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Passenger,
      Flight,
      Baggage,
      Notification,
    ]),
    AuthModule,
  ],
  providers: [BookingsService, BookingsResolver],
})
export class BookingsModule {}
