import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Role } from '../auth/roles.entity';
import { AdminService } from './admin/admin.service';
import { Permission } from '../auth/permissions.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Permission])],
  providers: [UsersService, AdminService],
  exports: [UsersService],
})
export class UsersModule {}
