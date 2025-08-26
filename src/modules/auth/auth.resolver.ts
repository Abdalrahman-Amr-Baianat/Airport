import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInputDto } from 'src/dtos/login.input';
import { AuthResponseDto } from 'src/dtos/auth-response';
import { UserType } from 'src/dtos/user.type';
import { RegisterInput } from 'src/dtos/register.input';
import { User } from '../users/users.entity';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponseDto)
  async login(@Args('input') loginInput: LoginInputDto) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    return this.authService.login(user);
  }

  @Mutation(() => UserType, { name: 'register' })
  async register(@Args('input') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => User)
  async verifyToken(@Args('input') token: string) {
    return this.authService.verifyToken(token);
  }
}
