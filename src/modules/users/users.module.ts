import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Role } from '../auth/roles.entity';
import { AdminService } from './admin/admin.service';
@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService, AdminService],
  exports: [UsersService, AdminService],
})
export class UsersModule {}
