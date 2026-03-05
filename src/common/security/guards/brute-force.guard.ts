import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { BruteForceService } from '../../../infrastructure/redis/brute-force.service';

@Injectable()
export class BruteForceGuard implements CanActivate {
  constructor(private readonly bruteForceService: BruteForceService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const ip = this.extractIp(request);

    const isBlocked = await this.bruteForceService.isBlocked(ip);
    if (isBlocked) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'Too many failed login attempts. Please try again in 15 minutes.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }

  private extractIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return request.ip ?? '0.0.0.0';
  }
}
