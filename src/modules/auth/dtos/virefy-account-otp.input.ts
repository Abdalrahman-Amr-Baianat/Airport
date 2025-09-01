import { InputType, Field } from '@nestjs/graphql';
import { OtpUseCaseEnum } from 'src/enums/otp-usecase.enum';

@InputType()
export class VerifyOtpInput {
  @Field()
  otp: string;
}
