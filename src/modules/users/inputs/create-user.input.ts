import { InputType, Field } from '@nestjs/graphql';
import { UserLocation } from 'src/models/user.model';

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  birthday: Date;

  @Field()
  location: UserLocation;
}
