import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/auth/entities/roles.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users.entity';
import { Airport } from 'src/modules/airports/airports.entity';
import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';
import { PermissionEnum } from 'src/enums/permission.enum';
import { UUID } from 'crypto';
import { CreateAirportDto } from 'src/modules/auth/dtos/create-airport.input';
import { RoleEnum } from 'src/enums/role.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Airport)
    private readonly airportRepo: Repository<Airport>,

    private readonly userService: UsersService,

    private readonly configService: ConfigService,
  ) {}

  async createRole(
    name: string,
    createdById?: string,
    permissions?: PermissionEnum[],
  ): Promise<Role> {
    const existing = await this.roleRepo.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException(`Role '${name}' already exists`);
    }

    let createdBy: User | undefined = undefined;
    if (createdById) {
      const foundUser = await this.userRepo.findOne({
        where: { id: createdById },
      });

      if (!foundUser) {
        throw new NotFoundException(`User with ID ${createdById} not found`);
      }

      createdBy = foundUser;
    }

    const role = this.roleRepo.create({
      name,
      createdBy,
      permissions: permissions || [],
    });

    return await this.roleRepo.save(role);
  }

  async onApplicationBootstrap() {
    const existingSuperAdminRole = await this.roleRepo.findOne({
      where: { name: RoleEnum.SUPER_ADMIN },
    });

    if (!existingSuperAdminRole) {
      await this.createRole(
        RoleEnum.SUPER_ADMIN,
        undefined,
        Object.values(PermissionEnum), 
      );
    }

    if (existingSuperAdminRole) {
      const allPermissions = Object.values(PermissionEnum);
    
      const currentPermissions = existingSuperAdminRole.permissions || [];
    
      const hasChanges =
        currentPermissions.length !== allPermissions.length ||
        !allPermissions.every((perm) => currentPermissions.includes(perm));
    
      if (hasChanges) {
        existingSuperAdminRole.permissions = allPermissions;
        await this.roleRepo.save(existingSuperAdminRole);
      }
    }

    const existingSuperAdmin = await this.userRepo.findOne({
      where: {
        roles: { name: RoleEnum.SUPER_ADMIN },
      },
    });

    if (!existingSuperAdmin) {
      const superAdmin = this.userService.create({
        name: 'SUPER_ADMIN',
        email:
          this.configService.get<string>('SUPER_ADMIN_EMAIL') ||
          'super@gmail.com',
        password:
          this.configService.get<string>('SUPER_ADMIN_PASSWORD') ||
          'superStrongPassword',
        roleNames: [RoleEnum.SUPER_ADMIN],

        isVerified: true,
      });
    }
  }

  async listRoles() {
    return this.roleRepo.find();
  }

  async assignRoleToUser(userId: UUID, roleName: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException('role not found');
    }

    user.roles = user.roles ?? [];

    const hasRole = user.roles.some((r) => r.id === role.id);
    if (!hasRole) {
      user.roles.push(role);
    }

    return this.userRepo.save(user);
  }

  async createAirport(input: CreateAirportDto, createdById?: string) {
    const existing = await this.airportRepo.findOne({
      where: { code: input.code },
    });
    if (existing) {
      throw new ConflictException(
        `Airport with code ${input.code} already exists`,
      );
    }

    const airport = this.airportRepo.create({
      ...input,
      createdById,
    });

    return await this.airportRepo.save(airport);
  }

  
}
