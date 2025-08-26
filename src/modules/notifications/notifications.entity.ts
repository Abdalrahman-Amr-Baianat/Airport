import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/users.entity';
import { Booking } from 'src/modules/bookings/bookings.entity';

@ObjectType()
@Entity('notifications')
export class Notification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Relation to User (nullable)
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.notifications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

  // Relation to Booking (nullable, contextual)
  @Field(() => Booking, { nullable: true })
  @ManyToOne(() => Booking, (booking) => booking.notifications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'booking_id' })
  booking?: Booking;

  @Field()
  @Column({ type: 'varchar' })
  channel: string; // email | sms | push

  @Field({ nullable: true })
  @Column({ type: 'varchar', nullable: true })
  subject?: string;

  @Field()
  @Column({ type: 'text' })
  message: string;

  @Field()
  @Column({ type: 'varchar' })
  status: string; // queued | sent | failed

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
