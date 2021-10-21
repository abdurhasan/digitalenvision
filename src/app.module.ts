import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/users/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BirthdayModule } from './modules/birthday/birthday.module';
import { ConfigModule } from './modules/config/config.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BirthdayModule,
    DatabaseModule,
    UserModule,
    GraphQLFederationModule.forRoot({
      introspection: true,
      autoSchemaFile: 'schema.gql',
      debug: true,
    }),
    {
      module: ConfigModule,
      global: true,
    },
  ],
})
export class AppModule {}
