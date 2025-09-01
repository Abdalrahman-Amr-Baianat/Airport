import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flight } from './flights.entity';
import { FlightStatusHistory } from './flight_status_history.entity';
import { FlightsResolver } from './flights.resolver';
import { FlightsService } from './flights.service';
import { Airline } from '../airlines/airlines.entity';
import { Airport } from '../airports/airports.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Flight, FlightStatusHistory, Airline, Airport]),
  ],
  providers: [FlightsResolver, FlightsService],
})
export class FlightsModule {}
