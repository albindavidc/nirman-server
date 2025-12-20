import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

export class loggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request: Request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(
        () => {
          const responseTime = Date.now() - startTime;
          this.logger.log(`${method} ${url} ${responseTime}ms`);
        },
        (error: unknown) => {
          const responseTime = Date.now() - startTime;
          this.logger.error(`${method} ${url} ${responseTime}ms`, error);
        },
      ),
    );
  }
}
