import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Flight } from './flights.entity';

// Enum for flight status
export enum FlightStatus {
  ON_TIME = 'on_time',
  DELAYED = 'delayed',
  CANCELED = 'canceled',
}

registerEnumType(FlightStatus, {
  name: 'FlightStatus',
  description: 'Status of the flight',
});

@ObjectType()
@Entity('flight_status_history')
@Index(['flight', 'updatedAt']) // composite index (flight_id, updated_at)
export class FlightStatusHistory {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Flight)
  @ManyToOne(() => Flight, (flight) => flight.statusHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @Field(() => FlightStatus)
  @Column({ type: 'enum', enum: FlightStatus })
  status: FlightStatus;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  note?: string;

  @Field()
  @CreateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  

}
