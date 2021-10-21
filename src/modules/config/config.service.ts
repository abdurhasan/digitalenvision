import { from } from 'env-var';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config({ path: '.env' });

@Injectable()
export class ConfigService {
  private env = from(process.env);

  public readonly PORT = this.env.get('PORT').required().asPortNumber();

  public readonly DB_TYPE = this.env.get('DB_TYPE').required().asString();

  public readonly DB_HOST = this.env.get('DB_HOST').required().asString();

  public readonly DB_PORT = this.env.get('DB_PORT').required().asPortNumber();

  public readonly DB_NAME = this.env.get('DB_NAME').required().asString();

  public readonly DB_USER = this.env.get('DB_USER').required().asString();

  public readonly DB_PASSWORD = this.env
    .get('DB_PASSWORD')
    .required()
    .asString();

  public readonly HOOKBIN_URL = this.env
    .get('HOOKBIN_URL')
    .required()
    .asString();

  public readonly BIRTHDAY_NOTIFICATION_LIMIT = this.env
    .get('BIRTHDAY_NOTIFICATION_LIMIT')
    .required()
    .asInt();

  public readonly THREAD_LIMIT = this.env
    .get('THREAD_LIMIT')
    .required()
    .asInt();
}
