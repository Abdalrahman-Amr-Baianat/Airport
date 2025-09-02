import { Field, ID, InputType } from '@nestjs/graphql';
import { BookingStatus } from '../bookings.entity';

@InputType()
export class CreateBookingDto {
  @Field(() => ID)
  flightId: string;

  @Field(() => ID)
  passengerId: string;

  @Field()
  seatNumber: string;

  @Field(() => BookingStatus, { defaultValue: 'booked' })
  status: BookingStatus;

  @Field({ nullable: true })
  baggageIds?: string[];

  @Field({ nullable: true })
  notificationIds?: string[];
}
