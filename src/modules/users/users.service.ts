import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../auth/entities/roles.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../auth/entities/user-roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    @InjectRepository(UserRole) private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  /////////////

  async create(data: {
    name: string;
    email: string;
    password: string;
    roleNames?: string[];
    createdById?: string;
    isVerified?: boolean;
  }): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    let roles: Role[] = [];
    if (data.roleNames && data.roleNames.length > 0) {
      roles = await this.roleRepo.find({ where: { name: In(data.roleNames) } });
    } else {
      const defaultRole = await this.roleRepo.findOne({
        where: { name: 'user' },
      });
      if (defaultRole) roles = [defaultRole];
    }

    const user = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      userRoles: roles,
      createdBy: data.createdById
        ? ({ id: data.createdById } as User)
        : undefined,
      isVerified: data.isVerified,
    });
    await this.userRepo.save(user)
    if (roles.length > 0) {
      const userRoles = roles.map((role) =>
        this.userRoleRepo.create({
          user,
          role,
        }),
      );
      await this.userRoleRepo.save(userRoles);
    }

    return user;
  }





  async findWithRoles(userIds: string[]) {
    return this.userRepo.find({
      where: { id: In(userIds) },
      relations: ['roles'],
    });
  }
}
