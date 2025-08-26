import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Resolver()
@UseGuards(JwtAuthGuard)
export class AppResolver {
  @Query(() => String, { name: 'test' })
  hello() {
    return 'Hello World!';
  }
}
