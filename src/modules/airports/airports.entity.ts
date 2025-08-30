import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Flight } from 'src/modules/flights/flights.entity';
import { Airline } from 'src/modules/airlines/airlines.entity';
import { User } from '../users/users.entity';

@ObjectType()
@Entity('airports')
export class Airport {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  code: string; // IATA airport code

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  city: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'createdById' })
  createdBy?: User;

  @Column({ nullable: true })
  createdById?: string;

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  timezone: string;

  @Field(() => [Flight], { nullable: true })
  @OneToMany(() => Flight, (flight) => flight.departureAirport)
  departureFlights?: Flight[];

  @Field(() => [Flight], { nullable: true })
  @OneToMany(() => Flight, (flight) => flight.destinationAirport)
  arrivalFlights?: Flight[];

  @Field(() => [Airline], { nullable: true })
  @OneToMany(() => Airline, (airline) => airline.airport)
  airlines?: Airline[];
}
