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
import { BruteForceGuard } from '../../common/security/guards/brute-force.guard';
import { Public } from '../../common/security/decorators/public.decorator';

// Redis services
import { BruteForceService } from '../../infrastructure/redis/brute-force.service';
import { SessionService } from '../../infrastructure/redis/session.service';

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
import { WorkerSignupCommand } from '../../application/commands/auth/worker-signup.command';
import { WorkerSignupDto } from '../../application/dto/auth/worker-signup.dto';
import { SupervisorSignupCommand } from '../../application/commands/auth/supervisor-signup.command';
import { SupervisorSignupDto } from '../../application/dto/auth/supervisor-signup.dto';

// Queries
import { GetProfileQuery } from '../../application/queries/profile/get-profile.query';

import { AUTH_ROUTES } from '../../common/constants/routes.constants';

@Controller(AUTH_ROUTES.ROOT)
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly bruteForceService: BruteForceService,
    private readonly sessionService: SessionService,
  ) {}

  @Public()
  @UseGuards(BruteForceGuard)
  @Post(AUTH_ROUTES.LOGIN)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const ip = this.extractIp(req);
    const deviceInfo = req.headers['user-agent'] ?? 'unknown';

    try {
      const result = (await this.commandBus.execute(
        new LoginCommand(dto.email, dto.password, ip, deviceInfo),
      )) as { accessToken: string; refreshToken: string; user: unknown };

      // Successful login — clear any brute-force counter for this IP
      await this.bruteForceService.clearAttempts(ip);

      const isProduction = process.env.NODE_ENV === 'production';

      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || '3600000'),
      });

      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || '2592000000'),
        path: `${AUTH_ROUTES.ROOT}/${AUTH_ROUTES.REFRESH}`,
      });

      return {
        message: 'Login successful',
        user: result.user,
      };
    } catch (err) {
      // Record failed attempt on any error from the command (invalid creds, etc.)
      await this.bruteForceService.recordFailedAttempt(ip);
      throw err;
    }
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

    const profile = await this.queryBus.execute(
      new GetProfileQuery(user.userId),
    );

    return profile;
  }

  @Post(AUTH_ROUTES.LOGOUT)
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Delete the Redis session if refresh token cookie is present
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    const user = req.user as { userId?: string } | undefined;
    if (refreshToken && user?.userId) {
      await this.sessionService.deleteSession(user.userId, refreshToken);
    }

    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
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

  @Public()
  @Post(AUTH_ROUTES.WORKER_SIGNUP)
  @HttpCode(HttpStatus.OK)
  workerSignup(@Body() dto: WorkerSignupDto) {
    return this.commandBus.execute(new WorkerSignupCommand(dto));
  }

  @Public()
  @Post(AUTH_ROUTES.SUPERVISOR_SIGNUP)
  @HttpCode(HttpStatus.OK)
  supervisorSignup(@Body() dto: SupervisorSignupDto) {
    return this.commandBus.execute(new SupervisorSignupCommand(dto));
  }

  private extractIp(request: Request): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return request.ip ?? '0.0.0.0';
  }
}
