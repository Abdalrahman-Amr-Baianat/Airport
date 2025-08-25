import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permissions.entity';
import { Role } from './roles.entity';

@Module({ imports: [TypeOrmModule.forFeature([Permission, Role])] })
export class AuthModule {}
