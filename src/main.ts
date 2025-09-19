import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

// Creamos la app de Express
const server = express();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors({
    origin: process.env.ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  await app.init();
}

// Ejecutamos bootstrap
bootstrap();

// Exportamos el handler que Vercel necesita
export default server;
