import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Role } from '../auth/entities/roles.entity';
import { AdminService } from './admin/admin.service';
import { EmailsModule } from '../emails/emails.module';
import { AirportsModule } from '../airports/airports.module';
import { Airport } from '../airports/airports.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Airport]),
    EmailsModule,
  ],
  providers: [UsersService, AdminService],
  exports: [UsersService, AdminService],
})
export class UsersModule {}
