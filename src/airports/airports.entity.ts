import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Flight } from 'src/flights/flights.entity';
import { Airline } from 'src/airlines/airlines.entity';

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

  @Field()
  @Column()
  country: string;

  @Field()
  @Column()
  timezone: string;

  // --- Reverse relation to flights (departures) ---
  @Field(() => [Flight], { nullable: true })
  @OneToMany(() => Flight, (flight) => flight.departureAirport)
  departureFlights?: Flight[];

  // --- Reverse relation to flights (arrivals) ---
  @Field(() => [Flight], { nullable: true })
  @OneToMany(() => Flight, (flight) => flight.destinationAirport)
  arrivalFlights?: Flight[];

  @Field(() => [Airline], { nullable: true })
  @OneToMany(() => Airline, (airline) => airline.airport)
  airlines?: Airline[];
}
