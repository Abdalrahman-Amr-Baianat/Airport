import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AssignRoleInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  roleName: string;
}
