import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const jwtAuthGuard = app.get(JwtAuthGuard);

  app.useGlobalGuards(jwtAuthGuard);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({
    origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
    credentials: true,
  })
  app.useStaticAssets(join(__dirname, '..', '..', 'uploads'), {
    prefix: '/uploads/',
  });

  console.log('Serving static files from:', join(__dirname, '..', '..', 'uploads'));
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
