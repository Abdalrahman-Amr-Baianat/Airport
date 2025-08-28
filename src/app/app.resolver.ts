import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Context } from '@nestjs/graphql';
import { HasPermissions } from 'src/decorators/permissions.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
@UseGuards(AuthGuard)
@Resolver()
export class AppResolver {
  @Query(() => String, { name: 'test' })
  hello() {
    console.log;
    return 'Hello World!';
  }

  @UseGuards(PermissionsGuard)
  @HasPermissions(PermissionEnum.SUPER_ADMIN)
  @Query(() => String)
  whoAmI(@Context() context) {
    console.log('Current user:', context.req.user);
    return `Hello ${context.req.user.email}`;
  }
}
