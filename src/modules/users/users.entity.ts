import { ObjectType, Field, ID, HideField } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
} from 'typeorm';
import { Role } from '../auth/entities/roles.entity';
import { Notification } from 'src/modules/notifications/notifications.entity';
import { Staff } from 'src/modules/staff/staff.entity';
import { Otp } from '../auth/entities/otps.entity';
import { UserRole } from '../auth/entities/user-roles.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ nullable: false, default: false })
  isVerified: boolean;

  @HideField()
  @Column({ type: 'varchar' })
  password: string;

  //  (who created this user)
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.createdUsers, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @Field(() => [User], { nullable: true })
  @OneToMany(() => User, (user) => user.createdBy)
  createdUsers?: User[];

  @Field(() => [UserRole], { nullable: true })
@OneToMany(() => UserRole, (userRole) => userRole.user)
userRoles: UserRole[];


  @OneToMany(() => Notification, (notification) => notification.user)
  notifications?: Notification[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps?: Otp[];

  @OneToOne(() => Staff, (staff) => staff.user)
  staff?: Staff;
}
