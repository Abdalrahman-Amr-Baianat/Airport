import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PassengersService } from './passengers.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { HasPermissions } from 'src/decorators/permissions.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';
import { Passenger } from './passengers.entity';
import { CreatePassengerDto } from './dtos/create-passenger.dto';
import { UpdatePassengerDto } from './dtos/update-passenger.dto';

@UseGuards(AuthGuard, PermissionsGuard)
@Resolver()
export class PassengersResolver {
  constructor(private readonly passengerService: PassengersService) {}
  @HasPermissions(PermissionEnum.MANAGE_PASSENGERS)
  @Mutation(() => [Passenger])
  async listAllPassengers() {
    return this.passengerService.listPassengers();
  }

  @HasPermissions(PermissionEnum.MANAGE_PASSENGERS)
  @Mutation(() => Passenger)
  async createPassenger(@Args('data') data: CreatePassengerDto) {
    return this.passengerService.createPassenger(data);
  }

  @HasPermissions(PermissionEnum.MANAGE_PASSENGERS)
  @Mutation(() => Passenger)
  async updatePassenger(@Args('data') data: UpdatePassengerDto) {
    return this.passengerService.updatePassenger(data);
  }

  @HasPermissions(PermissionEnum.MANAGE_PASSENGERS)
  @Mutation(() => Passenger)
  async deletePassenger(@Args('passportNumber') passportNumber: string) {
    return this.passengerService.deletePassenger(passportNumber);
  }

  @HasPermissions(PermissionEnum.MANAGE_PASSENGERS)
  @Mutation(() => Passenger)
  async getPassengerByPassportNumber(@Args('passportNumber') passportNumber: string) {
    return this.passengerService.getPassengerByPassportNumber(passportNumber);
  }

  
}
