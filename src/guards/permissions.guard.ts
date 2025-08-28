import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';
import { User } from 'src/modules/users/users.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract required permissions from decorator
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user; 

    if (!user) {
      return false;
    }

    const userPermissions = new Set<string>();

    if (user.permissions) {
      user.permissions.forEach((p) => userPermissions.add(p.name));
    }

    if (user.roles) {
      user.roles.forEach((role) => {
        if (role.permissions) {
          role.permissions.forEach((p) => userPermissions.add(p.name));
        }
      });
    }

    return requiredPermissions.every((perm) => userPermissions.has(perm));
  }
}
