import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser,
    info: Error | undefined,
  ): TUser {
    // Handle specific JWT errors
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException(
        'Refresh token has expired. Please login again.',
      );
    }

    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    if (err || !user) {
      throw new UnauthorizedException(
        err?.message || 'Refresh token is missing or invalid.',
      );
    }

    return user;
  }
}
