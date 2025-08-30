import { registerEnumType } from '@nestjs/graphql';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/modules/users/users.entity';
import { PermissionEnum } from 'src/enums/permission.enum';


registerEnumType(PermissionEnum, {
  name: 'PermissionEnum',
});
@ObjectType()
@Entity('roles')
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User;

  @Field(() => [PermissionEnum])
  @Column({
    type: 'enum',
    enum: PermissionEnum,
    array: true,
    default: [],
  })
  permissions: PermissionEnum[];

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}
