import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: process.env.ORIGIN ?? ['http://localhost:3000', 'https://liverpool-nine-dusky.vercel.app'],
    credentials: true,
  });

  if (process.env.NODE_ENV !== 'production') {
    await app.listen(process.env.PORT ?? 4000);
    console.log(`🚀 App corriendo en http://localhost:${process.env.PORT ?? 4000}`);
  } else {
    await app.init();
  }
}

bootstrap();

export default server;
