import { registerEnumType } from '@nestjs/graphql';

export enum RoleEnum {
  SUPER_ADMIN = 'Super_admin',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});
