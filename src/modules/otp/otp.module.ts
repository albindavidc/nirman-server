import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OtpController } from 'src/modules/otp/presentation/otp.controller';
import { SendOtpHandler } from 'src/modules/otp/application/handlers/send-otp.handler';
import { VerifyOtpHandler } from 'src/modules/otp/application/handlers/verify-otp.handler';
import { EmailService } from 'src/shared/infrastructure/services/email.service';
import { OtpStorageService } from 'src/modules/otp/infrastructure/services/otp-storage.service';

const CommandHandlers = [SendOtpHandler, VerifyOtpHandler];

@Module({
  imports: [CqrsModule],
  controllers: [OtpController],
  providers: [...CommandHandlers, EmailService, OtpStorageService],
  exports: [EmailService, OtpStorageService],
})
export class OtpModule {}
