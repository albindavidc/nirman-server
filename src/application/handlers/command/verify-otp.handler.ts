import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { VerifyOtpCommand } from 'src/application/command/verify-otp.command';
import { OtpStorageService } from 'src/infrastructure/services/otp-storage.service';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(private readonly otpStorageService: OtpStorageService) {}

  async execute(
    command: VerifyOtpCommand,
  ): Promise<{ verified: boolean; message: string }> {
    const { dto } = command;
    const email = dto.email.toLowerCase();

    const result = this.otpStorageService.validateOtp(email, dto.otp);

    if (!result.valid) {
      throw new BadRequestException(result.message);
    }

    return { verified: true, message: result.message };
  }
}
