import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Context } from '@nestjs/graphql';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@Resolver()
export class AppResolver {
  @Query(() => String, { name: 'test' })
  hello() {
    console.log
    return 'Hello World!';

  }

@Roles('user')
@Query(() => String)
whoAmI(@Context() context) {
  console.log('Current user:', context.req.user);
  return `Hello ${context.req.user.email}`;
}
}
