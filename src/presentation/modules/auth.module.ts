import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { AuthController } from '../controllers/auth.controller';
import { AdminSignupController } from '../controllers/admin-signup.controller';

// Handlers
import { LoginHandler } from '../../application/handlers/commands/auth/login.handler';
import { ForgotPasswordHandler } from '../../application/handlers/commands/auth/forgot-password.handler';
import { ResetPasswordHandler } from '../../application/handlers/commands/auth/reset-password.handler';
import { VerifyResetOtpHandler } from '../../application/handlers/commands/auth/verify-reset-otp.handler';
import { WorkerSignupHandler } from '../../application/handlers/commands/auth/worker-signup.handler';
import { SupervisorSignupHandler } from '../../application/handlers/commands/auth/supervisor-signup.handler';
import { CreateUserHandler } from '../../application/handlers/commands/user/create-user.handler';


// Repositories
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';

// Services
import { OtpStorageService } from '../../infrastructure/services/otp/otp-storage.service';
import { EmailService } from '../../infrastructure/services/email/email.service';
import { ResetTokenStorageService } from '../../infrastructure/services/auth/reset-token-storage.service';
import {
  EMAIL_SERVICE,
  OTP_STORAGE_SERVICE,
  RESET_TOKEN_STORAGE_SERVICE,
} from '../../application/interfaces';

// Redis
// import { RedisModule } from '../../infrastructure/redis/redis.module';
// import { SessionService } from '../../infrastructure/redis/session.service';
// import { BruteForceService } from '../../infrastructure/redis/brute-force.service';
// import { UserCacheService } from '../../infrastructure/redis/user-cache.service';

// Infrastructure
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { UploadModule } from '../modules/upload.module';

// Common - Security
import { JwtStrategy } from '../../common/security/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { RefreshTokenStrategy } from '../../common/security/strategies/refresh-token.strategy';
import { RolesGuard } from '../../common/security/guards/roles.guard';
import { RefreshTokenGuard } from '../../common/security/guards/refresh-token.guard';
import { BruteForceGuard } from '../../common/security/guards/brute-force.guard';

const CommandHandlers = [
  LoginHandler,
  ForgotPasswordHandler,
  VerifyResetOtpHandler,
  ResetPasswordHandler,
  WorkerSignupHandler,
  SupervisorSignupHandler,
  CreateUserHandler,
];

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    PrismaModule,
    // RedisModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET || 'default-access-secret',
      signOptions: { expiresIn: '1h' },
    }),
    UploadModule,
  ],
  controllers: [AuthController, AdminSignupController],

  providers: [
    ...CommandHandlers,
    { provide: USER_REPOSITORY, useClass: UserRepository },
    { provide: OtpStorageService, useClass: OtpStorageService },
    { provide: EmailService, useClass: EmailService },
    { provide: OTP_STORAGE_SERVICE, useClass: OtpStorageService },
    { provide: EMAIL_SERVICE, useClass: EmailService },
    {
      provide: RESET_TOKEN_STORAGE_SERVICE,
      useClass: ResetTokenStorageService,
    },
    // Guards & strategies
    JwtStrategy,
    JwtAuthGuard,
    RefreshTokenStrategy,
    RolesGuard,
    RefreshTokenGuard,
    BruteForceGuard,
  ],
  exports: [
    JwtModule,
    JwtAuthGuard,
    RolesGuard,
    RefreshTokenGuard,
    BruteForceGuard,
  ],
})
export class AuthModule {}
