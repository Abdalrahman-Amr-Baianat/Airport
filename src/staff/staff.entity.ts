import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/users.entity';
import { StaffRoleDomain } from './staff_roles_domain.entity';
import { StaffFlight } from './staff_flights.entity';

@ObjectType()
@Entity('staff')
export class Staff {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Each staff corresponds to exactly one user
  @Field(() => User)
  @OneToOne(() => User, (user) => user.staff, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
  employeeId: string;

  // Staff role (Pilot, Cabin Crew, Ground Staff, etc.)
  @Field(() => StaffRoleDomain)
  @ManyToOne(() => StaffRoleDomain, (role) => role.staff, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'staff_role_id' })
  staffRole: StaffRoleDomain;

  @OneToMany(() => StaffFlight, (staffFlight) => staffFlight.staff)
staffFlights?: StaffFlight[];

}
