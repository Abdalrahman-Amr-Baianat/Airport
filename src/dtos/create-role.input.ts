import { InputType, Field } from '@nestjs/graphql';
import { PermissionEnum } from '../enums/permission.enum';
import { IsEnum, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @Field()
  name: string;

  @Field(() => [PermissionEnum], { nullable: true })
  @IsArray()
  @IsOptional()
  @IsEnum(PermissionEnum, { each: true })
  permissions?: PermissionEnum[];
}
