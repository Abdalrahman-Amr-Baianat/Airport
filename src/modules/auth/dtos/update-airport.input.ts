import { Field, PartialType } from '@nestjs/graphql';
import { CreateAirportDto } from './create-airport.input';

export class UpdateAirportDto extends PartialType(CreateAirportDto) {
    
  @Field()
  flightNumber: string;
}
