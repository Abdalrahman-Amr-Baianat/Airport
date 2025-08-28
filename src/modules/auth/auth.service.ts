import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from 'src/dtos/register.input';
import { UsersService } from 'src/modules/users/users.service';
import { User } from '../users/users.entity';
import { UUID } from 'crypto';
import { OtpUseCaseEnum } from 'src/enums/otp-usecase.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otps.entity';
import { In, Repository } from 'typeorm';
import { EmailsService } from '../emails/emails.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailsService,

    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.signAsync({
        id: user.id,
      }),
    };
  }

  async register(registerInput: RegisterInput) {
    return this.usersService.create(registerInput);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.usersService.findById(decoded.id);
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async sendOtp(userId: UUID, useCase: OtpUseCaseEnum, expiryTime: number) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("user isn't found");
    }

    const otp = this.otpRepo.create({
      otpCode: Math.floor(1000 + Math.random() * 9000).toString(),
      user: user,
      expiresAt: new Date(Date.now() + expiryTime * 60 * 1000),
      useCase: useCase,
    });

    this.emailService.sendEmail(user.email, useCase, 'otp', {
      appName: 'AirPort',
      otp: otp.otpCode,
      expiresInMinutes: expiryTime,
      ctaUrl: 'https://github.com/Abdalrahman-Amr-Baianat',
      supportEmail: 'airport@gmail.com',
      year: 2025,
    });

    return this.otpRepo.save(otp);
  }

  async verifyAccountSendOtp(userId: UUID) {
    this.sendOtp(userId, OtpUseCaseEnum.VERIFY_EMAIL, 10);
  }

  async verifyOtp(userId: UUID, otp: string, useCase: OtpUseCaseEnum) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['otps'],
    });

    if (!user) throw new NotFoundException('user not found');
    const latestOtp = user.otps?.[user.otps.length - 1];

    if (!latestOtp) {
      throw new NotFoundException('No OTP found for this user');
    }

    if (
      otp !== latestOtp.otpCode ||
      latestOtp.useCase !== useCase ||
      (latestOtp.expiresAt && latestOtp.expiresAt.getTime() < Date.now())
    ) {
      throw new BadRequestException('Invalid OTP');
    }

    return true;
  }

  async verifyAccountVerifyOtp(
    userId: UUID,
    otp: string,
    useCase: OtpUseCaseEnum.VERIFY_EMAIL,
  ) {
    const isValid = await this.verifyOtp(userId, otp, useCase);
    if (isValid) {
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('user not found');
      }
      user.isVerified = true;
      return this.userRepo.save(user);
    }else { 
      throw new UnauthorizedException("stttttt")
    }
  }
}
