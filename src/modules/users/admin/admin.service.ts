import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/modules/auth/entities/roles.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users.entity';

import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';
import { PermissionEnum } from 'src/enums/permission.enum';
import { UUID } from 'crypto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

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
      where: { name: PermissionEnum.SUPER_ADMIN },
    });

    if (!existingSuperAdminRole) {
      await this.createRole(PermissionEnum.SUPER_ADMIN, undefined, [
        PermissionEnum.SUPER_ADMIN,
      ]);
    }

    const existingSuperAdmin = await this.userRepo.findOne({
      where: {
        roles: { name: PermissionEnum.SUPER_ADMIN },
      },
    });

    if (!existingSuperAdmin) {
      //TODO add all permissions
      const superAdmin = this.userService.create({
        name: 'SUPER_ADMIN',
        email:
          this.configService.get<string>('SUPER_ADMIN_EMAIL') ||
          'super@gmail.com',
        password:
          this.configService.get<string>('SUPER_ADMIN_PASSWORD') ||
          'superStrongPassword',
        roleNames: [PermissionEnum.SUPER_ADMIN],

        isVerified: true,
      });
    }
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

  
}
