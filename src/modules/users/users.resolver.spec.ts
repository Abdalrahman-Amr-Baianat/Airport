// // users.resolver.spec.ts
// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersResolver } from './users.resolver';
// import { UserRolesLoader } from './user.dataloader';
// import { User } from './users.entity';
// import { Role } from '../auth/entities/roles.entity';

// describe('UsersResolver', () => {
//   let resolver: UsersResolver;
//   let userRolesLoader: UserRolesLoader;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersResolver,
//         {
//           provide: UserRolesLoader,
//           useValue: {
//             createLoader: jest.fn().mockReturnValue({
//               load: jest.fn().mockResolvedValue([{ id: 1, name: 'Admin' } as Role]),
//             }),
//           },
//         },
//       ],
//     }).compile();

//     resolver = module.get<UsersResolver>(UsersResolver);
//     userRolesLoader = module.get<UserRolesLoader>(UserRolesLoader);
//   });

//   it('should resolve roles for a user', async () => {
//     const user: User = { id: '123', email: 'test@example.com' } as User;

//     const roles = await resolver.roles(user);

//     expect(roles).toEqual([{ id: 1, name: 'Admin' }]);
//     expect(userRolesLoader.createLoader).toHaveBeenCalled();
//   });
// });
