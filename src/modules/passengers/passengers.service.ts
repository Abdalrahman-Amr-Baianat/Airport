import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Passenger } from './passengers.entity';
import { CreatePassengerDto } from './dtos/create-passenger.dto';
import { User } from '../users/users.entity';
import { not } from 'rxjs/internal/util/not';
import { UpdatePassengerDto } from './dtos/update-passenger.dto';
import { Booking } from '../bookings/bookings.entity';

@Injectable()
export class PassengersService {
  constructor(
    @InjectRepository(Passenger)
    private readonly passengerRepo: Repository<Passenger>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createPassenger(data: CreatePassengerDto) {
    const user = await this.userRepo.findOne({ where: { id: data.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passenger = this.passengerRepo.create({
      name: user.name,
      passportNumber: data.passportNumber,
      nationality: data.nationality,
      user,
    });

    return this.passengerRepo.save(passenger);
  }

  async updatePassenger(data: UpdatePassengerDto) {
    const passenger = await this.passengerRepo.findOne({
      where: { passportNumber: data.passportNumber },
    });
    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }
    passenger.name = data.name ?? passenger.name;
    passenger.nationality = data.nationality ?? passenger.nationality;

    return this.passengerRepo.save(passenger);
  }

  async getPassengerByPassportNumber(passportNumber: string) {
    const passenger = await this.passengerRepo.findOne({
      where: { passportNumber },
    });
    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }
    return passenger;
  }

  async listPassengers() {
    return this.passengerRepo.find();
  }
  async deletePassenger(passportNumber: string) {
    const passenger = await this.passengerRepo.findOne({
      where: { passportNumber },
    });
    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }
    return this.passengerRepo.remove(passenger);
  }
  
}
