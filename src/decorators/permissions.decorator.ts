import { SetMetadata } from '@nestjs/common';
import { PermissionEnum } from 'src/enums/permission.enum';

export const PERMISSIONS_KEY = 'permissions';
export const HasPermissions = (...permissions: PermissionEnum[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
