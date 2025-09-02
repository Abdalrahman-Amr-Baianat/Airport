import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreatePassengerDto } from './create-passenger.dto';
@InputType()
export class UpdatePassengerDto extends PartialType(CreatePassengerDto) {
  @Field()
  passportNumber: string;
}
