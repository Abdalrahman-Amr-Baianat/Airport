import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Passenger } from './passengers.entity';

@Module({ imports: [TypeOrmModule.forFeature([Passenger])] })
export class PassengersModule {}
