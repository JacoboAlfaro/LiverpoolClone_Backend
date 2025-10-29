import cookieParser from 'cookie-parser';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no incluidas en el DTO
      forbidNonWhitelisted: true, // lanza error si se envían campos no válidos
      transform: true, // convierte tipos automáticamente (string → number, etc.)
    }),
  );

  app.enableCors({
    origin: ["http://localhost:3000", "https://liverpool-nine-dusky.vercel.app"],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();