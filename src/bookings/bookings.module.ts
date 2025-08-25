import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './bookings.entity';

@Module({ imports: [TypeOrmModule.forFeature([Booking])] })
export class BookingsModule {}
