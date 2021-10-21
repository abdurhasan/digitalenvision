import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from 'src/models/user.model';
import { CreateUserInput } from './inputs/create-user.input';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  @Inject()
  private readonly service: UserService;

  @Query(() => [User])
  getUser() {
    return this.service.getUser();
  }

  @Mutation(() => User)
  createUser(@Args('param') param: CreateUserInput) {
    return this.service.createUser(param);
  }

  @Mutation(() => Boolean)
  deleteUser(@Args('id') id: string) {
    return this.service.deleteUser(id);
  }
}
