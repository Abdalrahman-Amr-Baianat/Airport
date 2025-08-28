import { registerEnumType } from "@nestjs/graphql";

export enum PermissionEnum {
    SUPER_ADMIN = 'Super_admin',
    MANAGE_USERS = 'manage_users',
    MANAGE_ROLES = 'manage_roles',
    MANAGE_FLIGHTS = 'manage_flights',
    MANAGE_PASSENGERS = 'manage_passengers',
    MANAGE_STAFF = 'manage_staff',
    VIEW_FLIGHTS = 'view_flights',
    BOOK_FLIGHT = 'book_flight',
  }
  
  registerEnumType(PermissionEnum, {
    name: 'PermissionEnum', 
  });