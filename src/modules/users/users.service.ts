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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,
  ) {}

  ///////////////////////

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      relations: ['roles'],
    });
  }

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
      roles: roles,
      createdBy: data.createdById
        ? ({ id: data.createdById } as User)
        : undefined,
      isVerified: data.isVerified,
    });

    return this.userRepo.save(user);
  }

  //////////////////
  findById(id: string) {
    return this.userRepo.findOne({
      where: { id },
      relations: ['roles'],
    });
  }
}
