import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from 'src/dtos/register.input';
import { User } from '../users/users.entity';
import { UUID } from 'crypto';
import { OtpUseCaseEnum } from 'src/enums/otp-usecase.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/otps.entity';
import { In, Repository } from 'typeorm';
import { EmailsService } from '../emails/emails.service';
import { Role } from './entities/roles.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailsService,

    @InjectRepository(Otp) private readonly otpRepo: Repository<Otp>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { email } });
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


  async createNewUser(data: {
    name: string;
    email: string;
    password: string;
    roleNames?: string[];
    createdById?: string;
    isVerified?: boolean;
  }): Promise<User> {
    const existing = await this.userRepo.findOne({
      where: { email: data.email },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    let roles: Role[] = [];
    if (data.roleNames && data.roleNames.length > 0) {
      roles = await this.roleRepo.find({ where: { name: In(data.roleNames) } });
    } else {
      const defaultRole = await this.roleRepo.findOne({
        where: { name: 'user' },
      });
      if (defaultRole) roles = [defaultRole];
    }

    const user = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roles: roles,
      createdBy: data.createdById
        ? ({ id: data.createdById } as User)
        : undefined,
      isVerified: data.isVerified,
    });

    return this.userRepo.save(user);
  }

  async register(registerInput: RegisterInput) {
    return this.createNewUser(registerInput);
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userRepo.findOne({
        where: { id: decoded.id },
      });
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
    await this.otpRepo.delete({ user: { id: userId }, useCase });

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
    } else {
      throw new UnauthorizedException('Wrong OTP');
    }
  }
}
