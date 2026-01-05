import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = (request?.cookies as Record<string, string> | undefined)
            ?.refresh_token;
          return (token as string) || null;
        },
      ]),
      secretOrKey: process.env.REFRESH_TOKEN_SECRET || 'default-refresh-secret',
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const refreshToken = (req.cookies as Record<string, string>).refresh_token;
    return {
      ...payload,
      refreshToken,
    };
  }
}
