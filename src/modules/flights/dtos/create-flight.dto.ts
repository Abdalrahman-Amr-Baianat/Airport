import { InputType, Field, ID } from '@nestjs/graphql';
import { FlightStatus } from '../flights.entity';

@InputType()
export class CreateFlightDto {
  @Field()
  flightNumber: string;

  @Field(() => ID)
  airlineId: string;

  @Field(() => ID)
  departureAirportId: string;

  @Field(() => ID)
  destinationAirportId: string;

  @Field()
  departureTime: Date;

  @Field()
  arrivalTime: Date;

  @Field(() => FlightStatus)
  status: FlightStatus;

  @Field()
  totalSeats: number;

  @Field()
  availableSeats: number;

  @Field({ nullable: true })
  gate?: string;

  @Field({ nullable: true })
  terminal?: string;
}