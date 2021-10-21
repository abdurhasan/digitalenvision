import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotifMessage } from 'src/models/notif-message.model';
import { User } from 'src/models/user.model';
import { BirthdaySchedule } from './birthday.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([User, NotifMessage])],
  providers: [BirthdaySchedule],
})
export class BirthdayModule {}
