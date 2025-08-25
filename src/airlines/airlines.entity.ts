import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('airlines')
export class Airline {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Field()
  @Column({unique:true })
  code: string; // IATA/ICAO code

  @Field()
  @Column()
  name: string;
}
