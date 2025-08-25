import { Module } from '@nestjs/common';
import { InjectDataSource, TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { Airport } from './airports.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Airport])],
})
export class AirportsModule {}


// InjectDataSource;
