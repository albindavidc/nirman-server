import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './presentation/auth.controller';
import { ForgotPasswordHandler } from 'src/modules/auth/application/handlers/forgot-password.handler';
import { ResetPasswordHandler } from 'src/modules/auth/application/handlers/reset-password.handler';
import { UserRepository } from 'src/modules/user/infrastructure/persistence/user.repository';
import { USER_REPOSITORY } from 'src/modules/user/domain/repositories/user-repository.interface';
import { OtpStorageService } from 'src/modules/otp/infrastructure/services/otp-storage.service';
import { EmailService } from 'src/shared/infrastructure/services/email.service';
import { ResetTokenStorageService } from 'src/modules/auth/infrastructure/services/reset-token-storage.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/modules/auth/infrastructure/jwt.strategy';
import { JwtAuthGuard } from 'src/modules/auth/infrastructure/jwt-auth.guard';
import { LoginHandler } from './application/handlers/login.handler';
import { VerifyResetOtpHandler } from './application/handlers/verify-reset-otp.handler';

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
    OtpStorageService,
    EmailService,
    ResetTokenStorageService,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
