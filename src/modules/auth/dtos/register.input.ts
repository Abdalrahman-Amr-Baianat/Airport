import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [String], { nullable: true })
  roleNames?: string[];

  @Field({ nullable: true })
  createdById?: string;
}
