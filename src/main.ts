import { NestFactory } from '@nestjs/core';

import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/winston.config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { loggingInterceptor } from './logging.interceptor';
import cookieParser from 'cookie-parser';

import { HttpExceptionFilter } from './shared/infrastructure/common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  // Cookie parser for reading cookies
  app.use(cookieParser());

  // Enable validation pipe with transform for DTO transformations
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new loggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.error('Error starting the application:', err);
});
