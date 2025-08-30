import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInputDto } from 'src/dtos/login.input';
import { AuthResponseDto } from 'src/dtos/auth-response';
import { UserType } from 'src/dtos/user.type';
import { RegisterInput } from 'src/dtos/register.input';
import { User } from '../users/users.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { Role } from './entities/roles.entity';
import { CreateRoleInput } from 'src/dtos/create-role.input';
import { OtpUseCaseEnum } from 'src/enums/otp-usecase.enum';
import { VerifyOtpInput } from 'src/dtos/virefy-account-otp.input';
import { AssignRoleInput } from './dtos/assign-role.input';
import { UUID } from 'crypto';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
) {}

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
  @Mutation(() => String)
  verifyAccountSendOtp(@Context() context) {
    this.authService.verifyAccountSendOtp(context.req.user.id);
    return `Hello ${context.req.user.email}`;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => User)
  async verifyAccountVerifyOtp(
    @Context() context: any,
    @Args('input') data: VerifyOtpInput,
  ): Promise<User> {
    const userId = context.req.user.id;
    return this.authService.verifyAccountVerifyOtp(
      userId,
      data.otp,
      OtpUseCaseEnum.VERIFY_EMAIL,
    );
  }


}
