import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './staff.entity';
import { StaffRoleDomain } from './staff_roles_domain.entity';
import { StaffFlight } from './staff_flights.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Staff, StaffRoleDomain, StaffFlight])],
})
export class StaffModule {}
