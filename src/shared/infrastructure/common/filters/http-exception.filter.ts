//src/shared/infrastructure/common/filters/http-exception.filter.ts

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message || 'Internal Server Error';

    // Log the error
    if (status >= 500) {
      this.logger.error(
        `Error processing request ${request.method} ${request.url}`,
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception),
      );
    } else {
      this.logger.warn(
        `Warning processing request ${request.method} ${request.url}: ${JSON.stringify(
          message,
        )}`,
      );
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        exception instanceof HttpException
          ? exception.name
          : 'InternalServerError',
    });
  }
}
