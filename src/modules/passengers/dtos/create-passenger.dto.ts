import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreatePassengerDto {
  @Field()
  name: string;

  @Field()
  passportNumber: string;

  @Field()
  nationality: string;

  @Field(() => ID)
  userId: string;

  @Field(() => [ID], { nullable: true })
  bookingIds?: string[];
}
