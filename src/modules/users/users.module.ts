import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersService } from './users.service';
import { Role } from '../auth/roles.entity';
@Module({
  imports: [TypeOrmModule.forFeature([User]) , TypeOrmModule.forFeature([Role])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
