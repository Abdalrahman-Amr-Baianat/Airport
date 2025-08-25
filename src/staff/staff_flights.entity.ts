import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Staff } from './staff.entity';
import { Flight } from 'src/flights/flights.entity';

@ObjectType()
@Entity('staff_flights')
@Index(['staff', 'flight'], { unique: true }) // (staff_id, flight_id) unique
@Index(['flight']) // index on flight_id
export class StaffFlight {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // --- Staff relation ---
  @Field(() => Staff)
  @ManyToOne(() => Staff, (staff) => staff.staffFlights, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  // --- Flight relation ---
  @Field(() => Flight)
  @ManyToOne(() => Flight, (flight) => flight.staffFlights, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'flight_id' })
  flight: Flight;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  roleOnFlight?: string;

  @Field()
  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;
}
