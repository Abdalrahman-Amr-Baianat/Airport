import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { Passenger } from 'src/modules/passengers/passengers.entity';
import { Baggage } from 'src/modules/baggage/baggage.entity';
import { Flight } from 'src/modules/flights/flights.entity';
import { Notification } from 'src/modules/notifications/notifications.entity';

// --- Enum for booking status ---
export enum BookingStatus {
  BOOKED = 'booked',
  CANCELED = 'canceled',
  CHECKED_IN = 'checked_in',
}

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Current status of the booking',
});

@ObjectType()
@Entity('bookings')
@Unique('UQ_flight_seat', ['flight', 'seatNumber'])
@Unique('UQ_passenger_flight', ['passenger', 'flight'])
export class Booking {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Flight)
  @ManyToOne(() => Flight, (flight) => flight.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @Field(() => Passenger)
  @ManyToOne(() => Passenger, (passenger) => passenger.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'passenger_id' })
  passenger: Passenger;

  @Field()
  @Column({ type: 'varchar' })
  seatNumber: string;

  @Field(() => BookingStatus)
  @Column({ type: 'enum', enum: BookingStatus })
  status: BookingStatus;

  @Field()
  @CreateDateColumn({ name: 'booked_at' })
  bookedAt: Date;

  @Field(() => [Baggage], { nullable: true })
  @OneToMany(() => Baggage, (baggage) => baggage.booking)
  baggage?: Baggage[];

  @OneToMany(() => Notification, (notification) => notification.booking)
  notifications?: Notification[];
}
