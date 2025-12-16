import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { OtpController } from 'src/presentation/controllers/otp.controller';
import { SendOtpHandler } from 'src/application/handlers/command/send-otp.handler';
import { VerifyOtpHandler } from 'src/application/handlers/command/verify-otp.handler';
import { EmailService } from 'src/infrastructure/services/email.service';
import { OtpStorageService } from 'src/infrastructure/services/otp-storage.service';

const CommandHandlers = [SendOtpHandler, VerifyOtpHandler];

@Module({
  imports: [CqrsModule],
  controllers: [OtpController],
  providers: [...CommandHandlers, EmailService, OtpStorageService],
  exports: [EmailService, OtpStorageService],
})
export class OtpModule {}
