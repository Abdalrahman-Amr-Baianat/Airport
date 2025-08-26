import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Baggage } from './baggage.entity';

@Module({ imports: [TypeOrmModule.forFeature([Baggage])] })
export class BaggageModule {}
