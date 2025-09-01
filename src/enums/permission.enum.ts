import { registerEnumType } from '@nestjs/graphql';

export enum PermissionEnum {
  MANAGE_USERS = 'manage_users',
  MANAGE_ROLES = 'manage_roles',
  MANAGE_FLIGHTS = 'manage_flights',
  MANAGE_PASSENGERS = 'manage_passengers',
  MANAGE_STAFF = 'manage_staff',
  VIEW_FLIGHTS = 'view_flights',
  BOOK_FLIGHT = 'book_flight',
  CANCEL_BOOKING = 'cancel_booking',
  MANAGE_AIRPORTS = 'manage_airports',
  MANAGE_AIRlINES = 'manage_airlines',
}

registerEnumType(PermissionEnum, {
  name: 'PermissionEnum',
});
