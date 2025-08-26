import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInputDto } from 'src/dtos/login.input';
import { AuthResponseDto } from 'src/dtos/auth-response';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthResponseDto)
  async login(@Args('loginInput') loginInput: LoginInputDto) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    return this.authService.login(user);
  }
}
