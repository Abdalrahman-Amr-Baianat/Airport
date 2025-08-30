import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Context } from '@nestjs/graphql';
import { HasPermissions } from 'src/decorators/permissions.decorator';
import { PermissionEnum } from 'src/enums/permission.enum';
import { RoleEnum } from 'src/enums/role.enum';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';
import { Airport } from 'src/modules/airports/airports.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { EmailsService } from 'src/modules/emails/emails.service';

@UseGuards(AuthGuard)
@Resolver()
export class AppResolver {
  constructor(
    private readonly emailService: EmailsService,
    private readonly authService: AuthService,
  ) {}

  @Query(() => String, { name: 'test' })
  async hello() {
    // await this.emailService.sendEmail(
    //   'abdalrhmanamr2006@gmail.com',
    //   'test',
    //   'otp',
    //   {
    //     appName:"Airport",
    //     otp: '123456',
    //   }
    // );

    return 'Hello World!';
  }


  

  @UseGuards(PermissionsGuard)
  @Query(() => String)
  whoAmI(@Context() context) {
    console.log('Current user:', context.req.user);
    return `Hello ${context.req.user.email}`;
  }
}
