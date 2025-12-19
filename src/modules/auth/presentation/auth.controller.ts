import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/jwt-auth.guard';
import { LoginDto } from 'src/modules/auth/application/dto/login.dto';
import { ForgotPasswordDto } from 'src/modules/auth/application/dto/forgot-password.dto';
import { VerifyResetOtpDto } from 'src/modules/auth/application/dto/verify-reset-otp.dto';
import { ResetPasswordDto } from 'src/modules/auth/application/dto/reset-password.dto';
import { LoginCommand } from 'src/modules/auth/application/commands/login.command';
import { ForgotPasswordCommand } from 'src/modules/auth/application/commands/forgot-password.command';
import { VerifyResetOtpCommand } from 'src/modules/auth/application/commands/verify-reset-otp.command';
import { ResetPasswordCommand } from 'src/modules/auth/application/commands/reset-password.command';
import { LoginResult } from 'src/modules/auth/application/handlers/login.handler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result: LoginResult = await this.commandBus.execute(
      new LoginCommand(dto.email, dto.password),
    );

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
      path: '/auth/refresh', // Only send on refresh endpoint
    });

    return {
      message: 'Login successful',
      user: result.user,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      const newPayload = {
        sub: payload.sub,
        email: payload.email,
        role: payload.role,
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
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    // User is attached by JwtStrategy after token validation
    const user = (req as any).user;
    return {
      id: user.userId,
      email: user.email,
      role: user.role,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { message: 'Logged out successfully' };
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.commandBus.execute(new ForgotPasswordCommand(dto.email));
  }

  @Post('verify-reset-otp')
  @HttpCode(HttpStatus.OK)
  async verifyResetOtp(@Body() dto: VerifyResetOtpDto) {
    return this.commandBus.execute(
      new VerifyResetOtpCommand(dto.email, dto.otp),
    );
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.commandBus.execute(
      new ResetPasswordCommand(dto.email, dto.resetToken, dto.newPassword),
    );
  }
}
