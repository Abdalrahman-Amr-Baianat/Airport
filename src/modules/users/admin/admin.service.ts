import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/modules/auth/permissions.entity';
import { Role } from 'src/modules/auth/roles.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users.entity';

import { UserRoleEnum } from 'src/enums/role.enums';
import { UsersService } from '../users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UsersService,

    private readonly configService: ConfigService,
  ) {}

  async createRole(
    name: string,
    createdById?: string,
    permissionIds?: string[],
  ): Promise<Role> {
    const existing = await this.roleRepository.findOne({ where: { name } });
    if (existing) {
      throw new ConflictException(`Role '${name}' already exists`);
    }

    let createdBy: User | undefined = undefined;
    if (createdById) {
      const foundUser = await this.userRepository.findOne({
        where: { id: createdById },
      });

      if (!foundUser) {
        throw new NotFoundException(`User with ID ${createdById} not found`);
      }

      createdBy = foundUser;
    }

    let permissions: Permission[] = [];
    if (permissionIds && permissionIds.length > 0) {
      permissions = await this.permissionRepository.find({
        where: { id: In(permissionIds) },
      });
    }

    const role = this.roleRepository.create({
      name,
      createdBy,
      permissions,
    });
    return await this.roleRepository.save(role);
  }

  async onApplicationBootstrap() {
    const existingSuperAdminRole = await this.roleRepository.findOne({
      where: { name: UserRoleEnum.SUPER_ADMIN },
    });

    if (!existingSuperAdminRole) {
      await this.createRole(UserRoleEnum.SUPER_ADMIN);
    }

    const existingSuperAdmin = await this.userRepository.findOne({
      where: {
        roles: { name: UserRoleEnum.SUPER_ADMIN },
      },
    });

    // const existingSuperAdmin = await this.userRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.roles', 'role')
    //   .where('role.name = :roleName', { roleName: UserRoleEnum.SUPER_ADMIN })
    //   .getOne();

    if (!existingSuperAdmin) {
      const superAdmin = this.userService.create({
        name: 'SUPER_ADMIN',
        email:
          this.configService.get<string>('SUPER_ADMIN_EMAIL') ||
          'super@gmail.com',
        password:
          this.configService.get<string>('SUPER_ADMIN_PASSWORD') ||
          'superStrongPassword',
        roleNames: [UserRoleEnum.SUPER_ADMIN],
        
        isVerified: true,
      });
    }
  }
}
