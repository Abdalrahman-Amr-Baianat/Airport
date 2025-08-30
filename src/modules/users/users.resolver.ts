import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Role } from '../auth/entities/roles.entity';
import { CreateRoleInput } from 'src/dtos/create-role.input';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminService } from './admin/admin.service';
import { User } from './users.entity';
import { AssignRoleInput } from '../auth/dtos/assign-role.input';
import { UUID } from 'crypto';

@Resolver()
export class UsersResolver {
  constructor(private readonly adminService: AdminService) {}



  @UseGuards(AuthGuard) // add super admin guard
  @Mutation(() => Role)
  async createNewRole(
    @Args('input') data: CreateRoleInput,
    @Context() context,
  ) {
    return this.adminService.createRole(
      data.name,
      context.req.user.id,
      data.permissions,
    );
  }




  // add super admin guard
  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async assignRoleToUser(
    @Context() context: any,
    @Args('input') data: AssignRoleInput,
  ) {
    return this.adminService.assignRoleToUser(
      data.userId as UUID,
      data.roleName,
    );
  }
}
