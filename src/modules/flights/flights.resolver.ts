import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PermissionEnum } from 'src/enums/permission.enum';
import { HasPermissions } from 'src/decorators/permissions.decorator';
import { CreateFlightDto } from '../flights/dtos/create-flight.dto';
import { Flight } from '../flights/flights.entity';
import { UpdateFlightDto } from '../flights/dtos/update-flight.dto';
import { FlightsService } from '../flights/flights.service';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { UseGuards } from '@nestjs/common';

@UseGuards(AuthGuard, PermissionsGuard)

@Resolver()
export class FlightsResolver {
  constructor(private readonly flightService: FlightsService) {}


  //Flights
  @HasPermissions(PermissionEnum.MANAGE_FLIGHTS)
  @Mutation(() => Flight)
  async createFlight(@Args('input') input: CreateFlightDto) {
    return this.flightService.createFlight(input);
  }

  @HasPermissions(PermissionEnum.MANAGE_FLIGHTS)
  @Query(() => [Flight])
  async listFlights() {
    return this.flightService.listFlights();
  }

  @HasPermissions(PermissionEnum.MANAGE_FLIGHTS)
  @Mutation(() => Flight)
  async updateFlight(@Args('input') input: UpdateFlightDto) {
    return this.flightService.updateFlight(input);
  }

  @HasPermissions(PermissionEnum.MANAGE_FLIGHTS)
  @Mutation(() => Flight)
  async deleteFlight(
    @Args('flightNumber') flightNumber: string,
    @Args('airlineId') airlineId: string,
  ) {
    return this.flightService.deleteFlightByNumberAndAirlineId(
      flightNumber,
      airlineId,
    );
  }

  @HasPermissions(PermissionEnum.MANAGE_FLIGHTS)
  @Query(() => Flight)
  async findFlight(
    @Args('flightNumber') flightNumber: string,
    @Args('airlineId') airlineId: string,
  ) {
    return this.flightService.findFlightByNumberAndAirlineId(
      flightNumber,
      airlineId,
    );
  }
}
