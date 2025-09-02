import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './passengers.entity';
import { PassengersService } from './passengers.service';
import { PassengersResolver } from './passengers.resolver';
import { User } from '../users/users.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Passenger, User]), AuthModule],
  providers: [PassengersService, PassengersResolver],
})
export class PassengersModule {}
