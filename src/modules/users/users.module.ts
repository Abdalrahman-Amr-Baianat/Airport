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
import { Airline } from '../airlines/airlines.entity';
import { Flight } from '../flights/flights.entity';
import { FlightsModule } from '../flights/flights.module';
import { UserRolesLoader } from './user.dataloader';
import { UserRole } from '../auth/entities/user-roles.entity';

@Module({
  imports: [
    FlightsModule,
    TypeOrmModule.forFeature([User, Role, Airport, Airline, Flight, UserRole]),
    EmailsModule,
    AuthModule,
  ],
  providers: [UsersService, AdminService, UsersResolver, UserRolesLoader],
  exports: [UsersService, AdminService, UserRolesLoader],
})
export class UsersModule {}
