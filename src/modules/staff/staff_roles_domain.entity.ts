import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Staff } from './staff.entity';

@ObjectType()
@Entity('staff_roles_domain')
export class StaffRoleDomain {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
  name: string; // pilot | cabin_crew | ground | security | etc.

  @Field(() => [Staff], { nullable: true })
  @OneToMany(() => Staff, (staff) => staff.staffRole)
  staff?: Staff[];
}
