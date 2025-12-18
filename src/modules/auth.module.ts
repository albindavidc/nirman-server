import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from 'src/presentation/controllers/auth.controller';
import { LoginHandler } from 'src/application/handlers/command/login.handler';
import { ForgotPasswordHandler } from 'src/application/handlers/command/forgot-password.handler';
import { VerifyResetOtpHandler } from 'src/application/handlers/command/verify-reset-otp.handler';
import { ResetPasswordHandler } from 'src/application/handlers/command/reset-password.handler';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { USER_REPOSITORY } from 'src/domain/repositories';
import { OtpStorageService } from 'src/infrastructure/services/otp-storage.service';
import { EmailService } from 'src/infrastructure/services/email.service';
import { ResetTokenStorageService } from 'src/infrastructure/services/reset-token-storage.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from 'src/infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from 'src/infrastructure/auth/jwt-auth.guard';

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
