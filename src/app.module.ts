import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AirportsModule } from './modules/airports/airports.module';
import { AirlinesModule } from './modules/airlines/airlines.module';
import { FlightsModule } from './modules/flights/flights.module';
import { PassengersModule } from './modules/passengers/passengers.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { BaggageModule } from './modules/baggage/baggage.module';
import { StaffModule } from './modules/staff/staff.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { OperationsModule } from './modules/operations/operations.module';
import { databaseConfig } from './util/database.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app/app.resolver';
import { GlobalModule } from './modules/global/global.module';
import { EmailsModule } from './modules/emails/emails.module';
import { UsersResolver } from './modules/users/users.resolver';
@Module({
  imports: [
   
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      graphiql: true,
      autoSchemaFile: true,
    }),
    databaseConfig,
    GlobalModule,
    AuthModule,
    UsersModule,
    AirportsModule,
    AirlinesModule,
    FlightsModule,
    PassengersModule,
    BookingsModule,
    BaggageModule,
    StaffModule,
    NotificationsModule,
    OperationsModule,
    EmailsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver, UsersResolver],
})
export class AppModule {}
