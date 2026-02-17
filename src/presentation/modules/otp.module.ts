import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Controllers
import { OtpController } from '../controllers/otp.controller';

// Handlers
import { SendOtpHandler } from '../../application/handlers/commands/otp/send-otp.handler';
import { VerifyOtpHandler } from '../../application/handlers/commands/otp/verify-otp.handler';

// Services
import { EmailService } from '../../infrastructure/services/email/email.service';
import { OtpStorageService } from '../../infrastructure/services/otp/otp-storage.service';
import {
  EMAIL_SERVICE,
  OTP_STORAGE_SERVICE,
} from '../../application/interfaces';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository.interface';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

const CommandHandlers = [SendOtpHandler, VerifyOtpHandler];

@Module({
  imports: [CqrsModule],
  controllers: [OtpController],
  providers: [
    ...CommandHandlers,
    EmailService,
    OtpStorageService,
    // Interface tokens
    { provide: EMAIL_SERVICE, useClass: EmailService },
    { provide: EMAIL_SERVICE, useClass: EmailService },
    { provide: OTP_STORAGE_SERVICE, useClass: OtpStorageService },
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [EmailService, OtpStorageService],
})
export class OtpModule {}
