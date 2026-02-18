//src/infrastructure/common/filters/http-exception.filter.ts

import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'src/generated/client/client';
import { ApiErrorResponse } from '../interfaces/api-error-response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: string[] | null = null;
    let errorCode: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as {
          message?: string | string[];
          errors?: string[];
        };
        if (typeof responseObj.message === 'string') {
          message = responseObj.message || message;
        }
        if (Array.isArray(responseObj.errors)) {
          errors = responseObj.errors;
        } else if (Array.isArray(responseObj.message)) {
          errors = responseObj.message;
          message = 'Validation Error';
        }
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaException = exception;
      errorCode = prismaException.code;

      switch (prismaException.code) {
        case 'P2002': {
          // Unique constraint violation
          status = HttpStatus.CONFLICT;
          const targetMeta = prismaException.meta?.target;
          const target = Array.isArray(targetMeta)
            ? targetMeta.join(', ')
            : (targetMeta as string) || 'field';
          message = `A record with this ${target} already exists`;
          break;
        }
        case 'P2025': {
          // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'The requested record was not found';
          break;
        }
        default: {
          // Log the actual error for debugging but return a generic message
          this.logger.error(`Database error: ${prismaException.message}`);
          status = HttpStatus.SERVICE_UNAVAILABLE;
          message =
            'We are experiencing technical difficulties. Please try again later.';
          break;
        }
      }
    } else if (exception instanceof Error) {
      // Check for common connection/timeout errors
      if (
        exception.message.includes('Server selection timeout') ||
        exception.message.includes('No available servers') ||
        exception.message.includes('connection')
      ) {
        this.logger.error(`Connection error: ${exception.message}`);
        status = HttpStatus.SERVICE_UNAVAILABLE;
        message =
          'We are experiencing technical difficulties. Please try again later.';
      } else {
        // Generic error - don't expose internal error messages
        this.logger.error(`Unexpected error: ${exception.message}`);
        message = 'An unexpected error occurred. Please try again.';
      }
    }

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
        `Warning processing request ${request.method} ${request.url}: ${message}`,
      );
    }

    const errorResponse: ApiErrorResponse = {
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      errors: errors,
      errorCode: errorCode,
    };

    response.status(status).json(errorResponse);
  }
}
