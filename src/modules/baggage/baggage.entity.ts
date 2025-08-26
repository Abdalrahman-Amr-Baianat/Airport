import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Booking } from 'src/modules/bookings/bookings.entity';

export enum BaggageStatus {
  IN_TRANSIT = 'in_transit',
  LOADED = 'loaded',
  DELIVERED = 'delivered',
  LOST = 'lost',
}

registerEnumType(BaggageStatus, {
  name: 'BaggageStatus',
  description: 'Status of the baggage',
});

@ObjectType()
@Entity('baggage')
export class Baggage {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Booking)
  @ManyToOne(() => Booking, (booking) => booking.baggage, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;

  @Field()
  @Column({ type: 'varchar', unique: true })
  tagNumber: string;

  @Field(() => Float)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weight: number;

  @Field(() => BaggageStatus)
  @Column({ type: 'enum', enum: BaggageStatus })
  status: BaggageStatus;

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  lastSeenLocation?: string;
}
