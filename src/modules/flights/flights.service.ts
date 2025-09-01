import {
    ConflictException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import {  Repository } from 'typeorm';
  import { User } from '../users/users.entity';
  import { Airport } from 'src/modules/airports/airports.entity';
  import { UsersService } from '../users/users.service';
  import { ConfigService } from '@nestjs/config';
  import { Airline } from 'src/modules/airlines/airlines.entity';
  import { CreateFlightDto } from 'src/modules/flights/dtos/create-flight.dto';
  import { Flight } from 'src/modules/flights/flights.entity';
  import { UpdateFlightDto } from 'src/modules/flights/dtos/update-flight.dto';
  
@Injectable()
export class FlightsService {
constructor( 

    @InjectRepository(Airport)
    private readonly airportRepo: Repository<Airport>,

    @InjectRepository(Airline)
    private readonly airlineRepo: Repository<Airline>,

    @InjectRepository(Flight)
    private readonly flightRepo: Repository<Flight>,


    ) {}

    async createFlight(input: CreateFlightDto): Promise<Flight> {
        const existing = await this.flightRepo.findOne({
          where: {
            flightNumber: input.flightNumber,
            airline: { id: input.airlineId },
          },
          relations: ['airline'],
        });
        if (existing) {
          throw new ConflictException(
            `Flight with number ${input.flightNumber} already exists`,
          );
        }
        const airline = await this.airlineRepo.findOne({
          where: { id: input.airlineId },
        });
        const departureAirport = await this.airportRepo.findOne({
          where: { id: input.departureAirportId },
        });
        const destinationAirport = await this.airportRepo.findOne({
          where: { id: input.destinationAirportId },
        });
        if (!airline) {
          throw new NotFoundException(
            `Airline with ID ${input.airlineId} not found`,
          );
        }
        if (!departureAirport) {
          throw new NotFoundException(
            `Departure airport with ID ${input.departureAirportId} not found`,
          );
        }
        if (!destinationAirport) {
          throw new NotFoundException(
            `Destination airport with ID ${input.destinationAirportId} not found`,
          );
        }
        const flight = this.flightRepo.create({
          flightNumber: input.flightNumber,
          airline: { id: input.airlineId },
          departureAirport: { id: input.departureAirportId },
          destinationAirport: { id: input.destinationAirportId },
          departureTime: input.departureTime,
          arrivalTime: input.arrivalTime,
          status: input.status,
          totalSeats: input.totalSeats,
          availableSeats: input.availableSeats,
          gate: input.gate,
          terminal: input.terminal,
        });
        return this.flightRepo.save(flight);
      }
    
      async listFlights() {
        return this.flightRepo.find();
      }
    
      async findFlightByNumberAndAirlineId(
        flightNumber: string,
        airlineId: string,
      ) {
        return this.flightRepo.findOne({
          where: { flightNumber, airline: { id: airlineId } },
          relations: ['airline'],
        });
      }
    
      async updateFlight(input: UpdateFlightDto): Promise<Flight> {
        const flight = await this.flightRepo.findOne({
          where: {
            flightNumber: input.flightNumber,
            airline: { id: input.airlineId },
          },
          relations: ['airline'],
        });
        if (!flight) {
          throw new NotFoundException(
            `Flight with ID ${input.flightNumber} not found`,
          );
        }
    
        flight.flightNumber = input.flightNumber ?? flight.flightNumber;
        flight.airline = input.airlineId
          ? ({ id: input.airlineId } as any)
          : flight.airline;
        flight.departureAirport = input.departureAirportId
          ? ({ id: input.departureAirportId } as any)
          : flight.departureAirport;
        flight.destinationAirport = input.destinationAirportId
          ? ({ id: input.destinationAirportId } as any)
          : flight.destinationAirport;
        flight.departureTime = input.departureTime ?? flight.departureTime;
        flight.arrivalTime = input.arrivalTime ?? flight.arrivalTime;
        flight.status = input.status ?? flight.status;
        flight.totalSeats = input.totalSeats ?? flight.totalSeats;
        flight.availableSeats = input.availableSeats ?? flight.availableSeats;
        flight.gate = input.gate ?? flight.gate;
        flight.terminal = input.terminal ?? flight.terminal;
    
        return this.flightRepo.save(flight);
      }
    
      async deleteFlightByNumberAndAirlineId(
        flightNumber: string,
        airlineId: string,
      ) {
        return this.flightRepo.delete({ flightNumber, airline: { id: airlineId } });
      }
    
}
