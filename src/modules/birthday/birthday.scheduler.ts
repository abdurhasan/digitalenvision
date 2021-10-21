import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { MongoRepository } from 'typeorm';
import { ConfigService } from '../config/config.service';
import { Worker } from 'worker_threads';
import { IBirthdayWorkerParam, IBirthdayWorkerResponse } from './interfaces';
import { ObjectID } from 'mongodb';
import { toObjectId } from 'src/utils';
import * as moment from 'moment';
import { NotifMessage } from 'src/models/notif-message.model';

@Injectable()
export class BirthdaySchedule {
  @InjectRepository(User)
  private readonly repository: MongoRepository<User>;
  @InjectRepository(NotifMessage)
  private readonly messageRepo: MongoRepository<NotifMessage>;
  @Inject()
  private readonly config: ConfigService;

  @Cron(CronExpression.EVERY_YEAR)
  async activateBirthdayNotification(): Promise<void> {
    try {
      Logger.log('activateBirthdayNotification is running....');
      await this.repository.update({}, { isBirthdaySend: false });
      Logger.log('activateBirthdayNotification is done....');
    } catch (err) {
      Logger.error(
        err.message,
        err.stack,
        'BirthdaySchedule.activateBirthdayNotification',
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendBirthday(): Promise<void> {
    Logger.log('sendBirthday is running....');

    const limitThread: number = this.config.THREAD_LIMIT;

    const userTodayBirthday = await this.getUserBirthdayToday();

    const userSentBirthdayIds: ObjectID[] = [];

    while (userTodayBirthday.length > 0) {
      try {
        const { data: userSentIds }: IBirthdayWorkerResponse =
          await this.runBirthdayWorker(
            userTodayBirthday.splice(0, limitThread),
          );
        const userSentObjectIds = userSentIds.map((id) => toObjectId(id));
        userSentBirthdayIds.push(...userSentObjectIds);
      } catch (err) {
        Logger.error(err.message, err.stack, 'BirthdaySchedule.sendBirthday');
      }
    }

    await this.repository.updateMany(
      {
        _id: { $in: userSentBirthdayIds },
      },
      {
        $set: { isBirthdaySend: true },
      },
    );

    Logger.log(
      `sendBirthday is done ... total birthday notification ${userSentBirthdayIds.length}`,
    );
  }

  async getUserBirthdayToday(): Promise<User[]> {
    const limitData: number = this.config.BIRTHDAY_NOTIFICATION_LIMIT;

    return await this.repository.find({
      take: limitData,
      where: {
        $and: [
          { isBirthdaySend: false },
          { birthday: { $gte: new Date(moment().startOf('D').toISOString()) } },
          { birthday: { $lte: new Date(moment().endOf('D').toISOString()) } },
        ],
      },
    });
  }

  async runBirthdayWorker(userData: User[]): Promise<IBirthdayWorkerResponse> {
    const messageFormat =
      (await this.messageRepo.findOne())?.format ||
      'Hey, ${full_name} it’s your birthday';

    const paramWorker: IBirthdayWorkerParam = {
      baseUrl: this.config.HOOKBIN_URL,
      data: userData.map((user) => ({ ...user, id: user.id?.toString() })),
      messageFormat,
    };
    return new Promise((resolve, reject) => {
      const worker = new Worker(__dirname + '/birthday.worker.js', {
        workerData: paramWorker,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error('Worker has stopped'));
        }
      });
    });
  }
}
