import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String, { name: 'test' })
  hello() {
    return 'Hello World!';
  }
}
