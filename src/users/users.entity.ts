import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@ObjectType() 
@Entity('users') 
export class User {
  @Field(() =>ID)
  @PrimaryGeneratedColumn('uuid')
  id:string ;

  @Field()
  @Column({ type: 'varchar' })
  name: string;

  @Field()
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Field(() => ID, { nullable: true })
  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById?: string;

  
}
