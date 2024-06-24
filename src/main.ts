import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './socket-io/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  // Redis Websockets
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter(redisIoAdapter);
  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
