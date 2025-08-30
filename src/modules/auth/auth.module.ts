import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { Otp } from './entities/otps.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsModule } from '../emails/emails.module';
import { AirportsModule } from '../airports/airports.module';

@Module({
  imports: [AirportsModule,
    TypeOrmModule.forFeature([Otp]),
    EmailsModule,
    UsersModule,
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10d' }, //TODO decrease
        global: true,
      }),
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
