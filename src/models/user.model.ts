import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Field, ObjectType, ID, InputType } from '@nestjs/graphql';

@InputType('LocationInput')
@ObjectType('LocationType')
export class UserLocation {
  @Field()
  lat: number;
  @Field()
  long: number;
}

@Entity('users')
@ObjectType()
export class User {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectID | string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column()
  birthday: Date;

  @Field()
  @Column()
  location: UserLocation;

  @Field()
  @Column()
  isBirthdaySend: boolean;
}
