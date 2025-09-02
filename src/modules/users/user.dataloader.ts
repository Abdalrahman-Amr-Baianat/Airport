import DataLoader from 'dataloader';
import { UsersService } from './users.service';
import { Role } from '../auth/entities/roles.entity';
import { User } from './users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserRole } from '../auth/entities/user-roles.entity';
export class UserRolesLoader {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
  ) {}

  createLoader() {
    return new DataLoader<string, Role[]>(async (userIds: string[]) => {
      const userRoles = await this.userRoleRepo.find({
        where: { user: { id: In(userIds) } },
        select: ['user', 'role'], 
        relations: ['user', 'role'], 
      });

      const roleIds = userRoles.map((ur) => ur.role?.id).filter(Boolean);

      const roles = await this.roleRepo.find({
        where: { id: In(roleIds) },
      });

      const roleMap = new Map(roles.map((r) => [r.id, r]));

      const rolesMap: Record<string, Role[]> = {};
      userIds.forEach((id) => (rolesMap[id] = []));

      userRoles.forEach((ur) => {
        const userId = ur.user?.id;
        const role = roleMap.get(ur.role?.id);
        if (userId && role) {
          rolesMap[userId].push(role);
        }
      });

      return userIds.map((id) => rolesMap[id]);
    });
  }
}