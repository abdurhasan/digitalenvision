import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Field, ObjectType, ID } from '@nestjs/graphql';

@Entity('notifmessage')
@ObjectType()
export class NotifMessage {
  @ObjectIdColumn()
  @Field(() => ID)
  id: ObjectID;

  @Field()
  @Column()
  format: string;
}
