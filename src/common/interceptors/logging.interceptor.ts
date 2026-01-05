import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
  HttpException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user?: {
    userId: string;
  };
}

interface ErrorWithStatus extends Error {
  status?: number;
}

export class loggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<RequestWithUser>();
    const response = ctx.getResponse<Response>();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(
        () => {
          const responseTime = Date.now() - startTime;
          const statusCode = response.statusCode;
          const user = request.user?.userId || 'Anonymous';
          const ip = request.ip || request.socket.remoteAddress;

          this.logger.log(
            `${method} ${url} ${statusCode} ${responseTime}ms - User: ${user} - IP: ${ip}`,
          );
        },
        (error: unknown) => {
          const responseTime = Date.now() - startTime;
          let statusCode = 500;
          let stack = '';
          let message = '';

          if (error instanceof HttpException) {
            statusCode = error.getStatus();
            message = error.message;
            stack = error.stack || '';
          } else if (error instanceof Error) {
            const e = error as ErrorWithStatus;
            statusCode = e.status || 500;
            message = e.message;
            stack = e.stack || '';
          } else {
            message = JSON.stringify(error);
          }

          const user = request.user?.userId || 'Anonymous';
          const ip = request.ip || request.socket.remoteAddress;

          this.logger.error(
            `${method} ${url} ${statusCode} ${responseTime}ms - User: ${user} - IP: ${ip}`,
            stack || message,
          );
        },
      ),
    );
  }
}
