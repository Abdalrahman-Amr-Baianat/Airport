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
import { Airport } from 'src/modules/airports/airports.entity';

@ObjectType()
@Entity('airlines')
export class Airline {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  code: string; // IATA/ICAO code

  @Field()
  @Column()
  name: string;

  @Field(() => [Flight], { nullable: true })
  @OneToMany(() => Flight, (flight) => flight.airline)
  flights?: Flight[];

  @Field(() => Airport)
  @ManyToOne(() => Airport, (airport) => airport.airlines, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'airport_id' })
  airport: Airport;
}
