import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAirportDto {
  @Field()
  code: string;

  @Field()
  name: string;

  @Field()
  city: string;

  @Field()
  country: string;

  @Field()
  timezone: string;
}
