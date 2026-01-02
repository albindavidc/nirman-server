import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from '../controllers/auth.controller';

// Handlers
import { LoginHandler } from '../../application/handlers/commands/auth/login.handler';
import { ForgotPasswordHandler } from '../../application/handlers/commands/auth/forgot-password.handler';
import { ResetPasswordHandler } from '../../application/handlers/commands/auth/reset-password.handler';
import { VerifyResetOtpHandler } from '../../application/handlers/commands/auth/verify-reset-otp.handler';

// Repositories
import { UserRepository } from '../../infrastructure/persistence/repositories/user/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';

// Services
import { OtpStorageService } from '../../infrastructure/services/otp/otp-storage.service';
import { EmailService } from '../../infrastructure/services/email/email.service';
import { ResetTokenStorageService } from '../../infrastructure/services/auth/reset-token-storage.service';
import {
  EMAIL_SERVICE,
  OTP_STORAGE_SERVICE,
  RESET_TOKEN_STORAGE_SERVICE,
} from '../../application/interfaces/services';

// Infrastructure
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { JwtStrategy } from '../../infrastructure/security/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../infrastructure/security/guards/jwt-auth.guard';
import { RefreshTokenStrategy } from '../../infrastructure/security/strategies/refresh-token.strategy';
import { RolesGuard } from '../../infrastructure/security/guards/roles.guard';
import { RefreshTokenGuard } from '../../infrastructure/security/guards/refresh-token.guard';

const CommandHandlers = [
  LoginHandler,
  ForgotPasswordHandler,
  VerifyResetOtpHandler,
  ResetPasswordHandler,
];

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET || 'default-access-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    ...CommandHandlers,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: OtpStorageService, useClass: OtpStorageService }, // Keep class for now if used by class token elsewhere, or replace with symbol
    { provide: EmailService, useClass: EmailService },
    { provide: ResetTokenStorageService, useClass: ResetTokenStorageService },
    // Register tokens for interface injection
    { provide: OTP_STORAGE_SERVICE, useClass: OtpStorageService },
    { provide: EMAIL_SERVICE, useClass: EmailService },
    {
      provide: RESET_TOKEN_STORAGE_SERVICE,
      useClass: ResetTokenStorageService,
    },
    JwtStrategy,
    JwtAuthGuard,
    RefreshTokenStrategy,
    RolesGuard,
    RefreshTokenGuard,
  ],
  exports: [JwtModule, JwtAuthGuard, RolesGuard, RefreshTokenGuard],
})
export class AuthModule {}
