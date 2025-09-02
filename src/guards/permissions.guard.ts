import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    console.log("user", user);
    if (!user) return false;

    const userPermissions: PermissionEnum[] =
      user.userRoles
        ?.flatMap((ur) => ur.role?.permissions || [])
        .filter((p): p is PermissionEnum => !!p) || [];

    console.log('userPermissions', userPermissions);

    return requiredPermissions.every((perm) => userPermissions.includes(perm));
  }
}
