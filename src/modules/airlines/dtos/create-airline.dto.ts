import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateAirlineDto {
  @Field()
  code: string; // IATA/ICAO code

  @Field()
  name: string;

  @Field(() => ID, { nullable: true })
  airportId?: string;
}
