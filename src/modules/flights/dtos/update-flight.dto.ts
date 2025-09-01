import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreateFlightDto } from './create-flight.dto';
import { FlightStatus } from '../flights.entity';

@InputType()
export class UpdateFlightDto extends PartialType(CreateFlightDto) {
  @Field({ nullable: true })
  flightNumber: string;

  @Field(() => ID, { nullable: true })
  airlineId: string;

  @Field(() => ID, { nullable: true })
  departureAirportId?: string;

  @Field(() => ID, { nullable: true })
  destinationAirportId?: string;

  @Field({ nullable: true })
  departureTime?: Date;

  @Field({ nullable: true })
  arrivalTime?: Date;

  @Field(() => FlightStatus, { nullable: true })
  status?: FlightStatus;

  @Field({ nullable: true })
  totalSeats?: number;

  @Field({ nullable: true })
  availableSeats?: number;

  @Field({ nullable: true })
  gate?: string;

  @Field({ nullable: true })
  terminal?: string;
}
