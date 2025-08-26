import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterInput } from 'src/dtos/register.input';
import { UsersService } from 'src/modules/users/users.service';
import { User } from '../users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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
      access_token: this.jwtService.sign({...user}),
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
}
