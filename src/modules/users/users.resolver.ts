import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Role } from '../auth/entities/roles.entity';
import { CreateRoleInput } from 'src/modules/auth/dtos/create-role.input';
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
import { CreateAirlineDto } from '../airlines/dtos/create-airline.dto';
import { UserRolesLoader } from './user.dataloader';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly adminService: AdminService,
    private readonly UserRolesLoader: UserRolesLoader,
  ) {}

  //Roles
  @UseGuards(AuthGuard)
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

  // @HasPermissions(PermissionEnum.MANAGE_ROLES)
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

  // @HasPermissions(PermissionEnum.MANAGE_ROLES)
  @Query(() => [Role])
  async listRoles() {
    return this.adminService.listRoles();
  }

  //Airports
  @UseGuards(AuthGuard)
  @HasPermissions(PermissionEnum.MANAGE_AIRPORTS)
  @Mutation(() => Airport)
  async createAirport(
    @Args('input') input: CreateAirportDto,
    @Context() context: any,
  ) {
    return this.adminService.createAirport(input, context.req.user.id);
  }

  // @HasPermissions(PermissionEnum.MANAGE_AIRPORTS)
  @Query(() => [Airport])
  async listAirports() {
    return this.adminService.listAirports();
  }

  // @HasPermissions(PermissionEnum.MANAGE_AIRPORTS)
  @Query(() => Airport)
  async findAirportByCode(@Args('code') code: string) {
    return this.adminService.findAirportByCode(code);
  }

  // @HasPermissions(PermissionEnum.MANAGE_AIRPORTS)
  @Mutation(() => Airport)
  async updateAirportByCode(@Args('input') input: CreateAirportDto) {
    return this.adminService.updateAirport(input);
  }

  // @HasPermissions(PermissionEnum.MANAGE_AIRPORTS)
  @Mutation(() => Airport)
  async deleteAirportByCode(@Args('code') code: string) {
    return this.adminService.deleteAirportByCode(code);
  }

  //Airlines
  // @HasPermissions(PermissionEnum.MANAGE_AIRlINES)
  @Mutation(() => Airport)
  async createAirline(@Args('input') input: CreateAirlineDto) {
    return this.adminService.createAirline(input);
  }

  // @HasPermissions(PermissionEnum.MANAGE_AIRlINES)
  @Query(() => [Airport])
  async listAirlines() {
    return this.adminService.listAirlines();
  }

  // @HasPermissions(PermissionEnum.MANAGE_AIRlINES)
  @Query(() => Airport)
  async findAirlineByCode(@Args('code') code: string) {
    return this.adminService.findAirlineByCode(code);
  }

  // @HasPermissions(PermissionEnum.MANAGE_AIRlINES)
  @Mutation(() => Airport)
  async deleteAirlineByCode(@Args('code') code: string) {
    return this.adminService.deleteAirlineByCode(code);
  }

  @ResolveField(() => [Role])
  async roles(@Parent() user: User): Promise<Role[]> {
    const loader = this.UserRolesLoader.createLoader();
    return loader.load(user.id);
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  @HasPermissions(PermissionEnum.MANAGE_USERS)
  async getUser(@Context() context) {
    return context.req.user;
  }
}
