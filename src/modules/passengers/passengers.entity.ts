import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/modules/users/users.entity';
import { Booking } from 'src/modules/bookings/bookings.entity';
@ObjectType()
@Entity('passengers')
export class Passenger {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ unique: true })
  passportNumber: string;

  @Field()
  @Column()
  nationality: string;

  // --- One-to-One relation with User ---
  @Field(() => User)
  @OneToOne(() => User, { onDelete: 'CASCADE' }) // if user is deleted → passenger deleted
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [Booking], { nullable: true })
  @OneToMany(() => Booking, (booking) => booking.passenger)
  bookings?: Booking[];
}
