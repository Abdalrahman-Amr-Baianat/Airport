import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Role } from '../auth/entities/roles.entity';
import { CreateRoleInput } from 'src/dtos/create-role.input';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminService } from './admin/admin.service';
import { User } from './users.entity';
import { AssignRoleInput } from '../auth/dtos/assign-role.input';
import { UUID } from 'crypto';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { PermissionEnum } from 'src/enums/permission.enum';
import { HasPermissions } from 'src/decorators/permissions.decorator';
import { Airport } from '../airports/airports.entity';
import { CreateAirportDto } from '../auth/dtos/create-airport.input';

@UseGuards(AuthGuard, PermissionsGuard)
@Resolver()
export class UsersResolver {
  constructor(private readonly adminService: AdminService) {}


  //Roles
  @HasPermissions(PermissionEnum.MANAGE_ROLES)
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

  @HasPermissions(PermissionEnum.MANAGE_ROLES)
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
  

  @HasPermissions(PermissionEnum.MANAGE_ROLES)
  @Query(() => [Role])
  async listRoles() {
    return this.adminService.listRoles();
  }


//Airports
  @HasPermissions(PermissionEnum.MANAGE_AIRPORTS)
  @Mutation(() => Airport)
  async createAirport(
    @Args('input') input: CreateAirportDto,
    @Context() context: any,
  ) {
    return this.adminService.createAirport(input, context.req.user.id);
  }

//complete the airport CRUD 
}
