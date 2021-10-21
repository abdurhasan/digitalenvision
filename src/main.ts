import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './modules/config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(ConfigService);

  await app.listen(env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
