import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Role } from '../auth/entities/roles.entity';
import { AdminService } from './admin/admin.service';
import { EmailsModule } from '../emails/emails.module';
import { Airport } from '../airports/airports.entity';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Airport]),
    EmailsModule,
    AuthModule,
  ],
  providers: [UsersService, AdminService, UsersResolver],
  exports: [UsersService, AdminService],
})
export class UsersModule {}
