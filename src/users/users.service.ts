import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}



  // To get role permissions and direct permissions
  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions', 'permissions'],
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const rolePermissions =
      user.roles?.flatMap((r) => r.permissions?.map((p) => p.name) ?? []) ?? [];

    const directPermissions = user.permissions?.map((p) => p.name) ?? [];

    return Array.from(new Set([...rolePermissions, ...directPermissions]));
  }



  async findByEmail(email: string){
    return this.userRepo.findOneBy({email})
  }
}
