import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permissions.entity';
import { Role } from './roles.entity';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule,
    PassportModule,
    ConfigModule, // already global if you used isGlobal: true
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '10d' },
      }),
    }),
    TypeOrmModule.forFeature([Permission, Role]),
    UsersModule,
    JwtModule,
  ],
  providers: [AuthService, AuthResolver],
  controllers: [AuthController],
  
})
export class AuthModule {}
