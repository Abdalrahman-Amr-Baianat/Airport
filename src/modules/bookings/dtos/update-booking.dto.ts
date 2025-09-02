import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateBookingDto } from './create-booking.dto';

@InputType()
export class UpdateBookingDto extends PartialType(CreateBookingDto) {
  @Field(() => ID)
  id: string;
}
