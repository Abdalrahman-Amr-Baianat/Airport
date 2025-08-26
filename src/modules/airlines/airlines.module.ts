import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Airline } from './airlines.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airline])],
})
export class AirlinesModule {}
