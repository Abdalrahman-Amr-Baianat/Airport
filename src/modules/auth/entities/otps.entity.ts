import { Field, ID, ObjectType } from '@nestjs/graphql';
import { OtpUseCaseEnum } from 'src/enums/otp-usecase.enum';
import { User } from 'src/modules/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('otps')
export class Otp {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => OtpUseCaseEnum)
  @Column({
    type: 'enum',
    enum: OtpUseCaseEnum,
    default: OtpUseCaseEnum.UNDEFINED_USE_CASE,
    nullable: false,
  })
  useCase: OtpUseCaseEnum;

  
  @Field()
  @Column({ type: 'varchar', length: 4 })
  otpCode: string;

  @Field({ nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.otps, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
