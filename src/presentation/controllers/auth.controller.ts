import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';

// Common - Security
import { RefreshTokenGuard } from '../../common/security/guards/refresh-token.guard';
import { Public } from '../../common/security/decorators/public.decorator';

// DTOs
import { LoginDto } from '../../application/dto/auth/login.dto';
import { ForgotPasswordDto } from '../../application/dto/auth/forgot-password.dto';
import { VerifyResetOtpDto } from '../../application/dto/auth/verify-reset-otp.dto';
import { ResetPasswordDto } from '../../application/dto/auth/reset-password.dto';

// Commands
import { LoginCommand } from '../../application/commands/auth/login.command';
import { ForgotPasswordCommand } from '../../application/commands/auth/forgot-password.command';
import { VerifyResetOtpCommand } from '../../application/commands/auth/verify-reset-otp.command';
import { ResetPasswordCommand } from '../../application/commands/auth/reset-password.command';

// Queries
import { GetProfileQuery } from '../../application/queries/profile/get-profile.query';

import { AUTH_ROUTES } from '../../app.routes';

@Controller(AUTH_ROUTES.ROOT)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post(AUTH_ROUTES.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = (await this.commandBus.execute(
      new LoginCommand(dto.email, dto.password),
    )) as { accessToken: string; refreshToken: string; user: unknown };

    // Set HTTP-only cookies
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || '3600000'), // 1 hour
    });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || '2592000000'), // 30 days
      path: `${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.REFRESH}`, // Only send on refresh endpoint
    });

    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  @Public()
  @Post(AUTH_ROUTES.REFRESH)
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as {
      sub: string;
      email: string;
      role: string;
      refreshToken: string;
    };

    const newPayload = {
      sub: user.sub,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(newPayload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: '1h',
    });

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || '3600000'),
    });

    return { message: 'Token refreshed successfully' };
  }

  @Get(AUTH_ROUTES.ME)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    const user = (
      req as Request & {
        user: {
          userId: string;
          email: string;
          role: string;
        };
      }
    ).user;

    // Use GetProfileQuery to fetch full user details + fresh Presigned URL for photo
    const profile = await this.queryBus.execute(
      new GetProfileQuery(user.userId),
    );

    return profile;
  }

  @Post(AUTH_ROUTES.LOGOUT)
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', {
      path: `${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.REFRESH}`,
    });
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post(AUTH_ROUTES.FORGOT_PASSWORD)
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.commandBus.execute(new ForgotPasswordCommand(dto.email));
  }

  @Public()
  @Post(AUTH_ROUTES.VERIFY_RESET_OTP)
  @HttpCode(HttpStatus.OK)
  verifyResetOtp(@Body() dto: VerifyResetOtpDto) {
    return this.commandBus.execute(
      new VerifyResetOtpCommand(dto.email, dto.otp),
    );
  }

  @Public()
  @Post(AUTH_ROUTES.RESET_PASSWORD)
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.commandBus.execute(
      new ResetPasswordCommand(dto.email, dto.resetToken, dto.newPassword),
    );
  }
}
