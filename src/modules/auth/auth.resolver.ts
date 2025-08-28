import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInputDto } from 'src/dtos/login.input';
import { AuthResponseDto } from 'src/dtos/auth-response';
import { UserType } from 'src/dtos/user.type';
import { RegisterInput } from 'src/dtos/register.input';
import { User } from '../users/users.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { Role } from './roles.entity';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRoleEnum } from 'src/enums/role.enums';

@UseGuards(RolesGuard)
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

  @UseGuards(AuthGuard)
  @Query(() => String)
  whoAre(@Context() context) {
    console.log('Current user:', context.req.user);
    return `Hello ${context.req.user.email}`;
  }

  @Roles(UserRoleEnum.SUPER_ADMIN)
  createNewRole() {}
}
