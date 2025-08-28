import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';
@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
  ],
  exports: [
    TypeOrmModule,
  ],
})
export class GlobalModule {}
