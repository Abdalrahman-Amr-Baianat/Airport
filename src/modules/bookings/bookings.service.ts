import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking } from './bookings.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { Flight } from '../flights/flights.entity';
import { Passenger } from '../passengers/passengers.entity';
import { UpdateBookingDto } from './dtos/update-booking.dto';
import { Baggage } from '../baggage/baggage.entity';
import { Notification } from '../notifications/notifications.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(Flight) private readonly flightRepo: Repository<Flight>,

    @InjectRepository(Passenger)
    private readonly passengerRepo: Repository<Passenger>,

    @InjectRepository(Baggage)
    private readonly baggageRepo: Repository<Baggage>,

    @InjectRepository(Notification)
    private readonly notificationsRepo: Repository<Notification>,
  ) {}

  async createBooking(data: CreateBookingDto): Promise<Booking> {
    const flight = await this.flightRepo.findOne({
      where: { id: data.flightId },
    });
    if (!flight) {
      throw new NotFoundException('Flight not found');
    }
  
    const passenger = await this.passengerRepo.findOne({
      where: { id: data.passengerId },
    });
    if (!passenger) {
      throw new NotFoundException('Passenger not found');
    }
  
    const takenSeat = await this.bookingRepo.findOne({
      where: { flight: { id: flight.id }, seatNumber: data.seatNumber },
    });
    if (takenSeat) {
      throw new ConflictException('Seat already taken');
    }
  
    const booking = this.bookingRepo.create({
      flight,
      passenger,
      seatNumber: data.seatNumber,
      status: data.status ?? 'booked',
    });
  
    if (data.baggageIds?.length) {
      const baggageList = await this.baggageRepo.find({
        where: { id: In(data.baggageIds) },
      });
      booking.baggage = baggageList;
    }
  
    if (data.notificationIds?.length) {
      const notifications = await this.notificationsRepo.find({
        where: { id: In(data.notificationIds) },
      });
      booking.notifications = notifications;
    }
  
    return this.bookingRepo.save(booking);
  }
  

  async updateBookingById(data: UpdateBookingDto): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id: data.id },
      relations: ['flight', 'passenger', 'baggage', 'notifications'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (data.flightId) {
      const flight = await this.flightRepo.findOne({
        where: { id: data.flightId },
      });
      if (!flight) {
        throw new NotFoundException('Flight not found');
      }
      booking.flight = flight;
    }

    if (data.passengerId) {
      const passenger = await this.passengerRepo.findOne({
        where: { id: data.passengerId },
      });
      if (!passenger) {
        throw new NotFoundException('Passenger not found');
      }
      booking.passenger = passenger;
    }

    if (data.seatNumber) {
      const takenSeat = await this.bookingRepo.findOne({
        where: {
          flight: booking.flight,
          seatNumber: data.seatNumber,
        },
      });

      if (takenSeat && takenSeat.id !== booking.id) {
        throw new ConflictException('Seat already taken');
      }
      booking.seatNumber = data.seatNumber;
    }

    if (data.status) {
      booking.status = data.status;
    }

    if (data.baggageIds) {
      const baggageList = await this.baggageRepo.find({
        where: { id: In(data.baggageIds) },
      });
    }

    if (data.notificationIds) {
      const notifications = await this.notificationsRepo.findByIds(
        data.notificationIds,
      );
      booking.notifications = notifications;
    }

    return this.bookingRepo.save(booking);
  }

  async getBookings(): Promise<Booking[]> {
    return this.bookingRepo.find({
      relations: ['flight', 'passenger'],
    });
  }

  async getBooking(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id: id },
      relations: ['flight', 'passenger'],
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async deleteBooking(id: string): Promise<Booking> {
    const booking = await this.getBooking(id);
    return this.bookingRepo.remove(booking);
  }
}
