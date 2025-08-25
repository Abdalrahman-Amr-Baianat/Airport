import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './flights.entity';
import { FlightStatusHistory } from './flight_status_history.entity';

@Module({ imports: [TypeOrmModule.forFeature([Flight, FlightStatusHistory])] })
export class FlightsModule {}
