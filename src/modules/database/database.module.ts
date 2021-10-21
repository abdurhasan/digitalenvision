import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (config: ConfigService) => {
        return {
          type: 'mongodb',
          host: config.DB_HOST,
          port: config.DB_PORT,
          username: config.DB_USER,
          password: config.DB_PASSWORD,
          database: config.DB_NAME,

          entities: [__dirname + '/../../models/**/*{.ts,.js}'],
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
