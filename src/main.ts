import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggingInterceptor } from './logging.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cookie parser for reading cookies
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  app.useGlobalInterceptors(new loggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
