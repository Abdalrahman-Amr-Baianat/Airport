import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Airline } from 'src/modules/airlines/airlines.entity';
import { Airport } from 'src/modules/airports/airports.entity';
import { Booking } from 'src/modules/bookings/bookings.entity';
import { StaffFlight } from 'src/modules/staff/staff_flights.entity';
import { FlightStatusHistory } from './flight_status_history.entity';

export enum FlightStatus {
  SCHEDULED = 'scheduled',
  BOARDING = 'boarding',
  DEPARTED = 'departed',
  IN_AIR = 'in_air',
  DELAYED = 'delayed',
  LANDED = 'landed',
  CANCELLED = 'cancelled',
  DIVERTED = 'diverted',
}

registerEnumType(FlightStatus, {
  name: 'FlightStatus',
  description: 'Status of the flight',
});

@ObjectType()
@Entity('flights')
@Index('IDX_flight_number_departure_time', ['flightNumber', 'departureTime'])
@Index('IDX_airline_id', ['airline'])
@Index('IDX_departure_airport_id', ['departureAirport'])
@Index('IDX_destination_airport_id', ['destinationAirport'])
@Index('IDX_departure_time', ['departureTime'])
@Unique('UQ_flight_airline_number', ['flightNumber', 'airline'])
export class Flight {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'varchar' })
  flightNumber: string;

  @Field(() => Airline)
  @ManyToOne(() => Airline, (airline) => airline.flights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'airline_id' })
  airline: Airline;

  @Field(() => Airport)
  @ManyToOne(() => Airport, (airport) => airport.departureFlights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'departure_airport_id' })
  departureAirport: Airport;

  @Field(() => Airport)
  @ManyToOne(() => Airport, (airport) => airport.arrivalFlights, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'destination_airport_id' })
  destinationAirport: Airport;

  @Field()
  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Field()
  @Column({ type: 'timestamp' })
  arrivalTime: Date;

  @Field(() => FlightStatus)
  @Column({ type: 'enum', enum: FlightStatus, enumName: 'flight_status_enum' })
  status: FlightStatus;

  @Field()
  @Column({ type: 'int' })
  totalSeats: number;

  @Field()
  @Column({ type: 'int' })
  availableSeats: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  gate?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  terminal?: string;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.flight)
  bookings?: Booking[];

  @OneToMany(() => StaffFlight, (staffFlight) => staffFlight.flight)
  staffFlights?: StaffFlight[];

  @OneToMany(() => FlightStatusHistory, (history) => history.flight)
  statusHistory?: FlightStatusHistory[];
}
