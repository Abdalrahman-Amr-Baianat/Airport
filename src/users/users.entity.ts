import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable, OneToOne } from 'typeorm';
import { Permission } from 'src/auth/permissions.entity';
import { Role } from 'src/auth/roles.entity';
import { Notification } from 'src/notifications/notifications.entity';
import { Staff } from 'src/staff/staff.entity';


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

  @Column({ type: 'varchar' })
  password: string;

  // --- Self relation (who created this user) ---
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

  // --- Permissions relation ---
  @Field(() => [Permission], { nullable: true })
  @ManyToMany(() => Permission, (permission) => permission.users, { cascade: true })
  @JoinTable({
    name: 'user_permissions', // custom join table
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions?: Permission[];





  @Field(() => [Role], { nullable: true })
  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles?: Role[];


  @OneToMany(() => Notification, (notification) => notification.user)
notifications?: Notification[];



@OneToOne(() => Staff, (staff) => staff.user)
staff?: Staff;

}
