import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyResetOtpCommand } from '../commands/verify-reset-otp.command';
import { OtpStorageService } from 'src/modules/otp/infrastructure/services/otp-storage.service';
import { ResetTokenStorageService } from 'src/modules/auth/infrastructure/services/reset-token-storage.service';
import { BadRequestException } from '@nestjs/common';
import { VerifyResetOtpResponseDto } from '../dto/verify-reset-otp.dto';

@CommandHandler(VerifyResetOtpCommand)
export class VerifyResetOtpHandler implements ICommandHandler<VerifyResetOtpCommand> {
  constructor(
    private readonly otpStorageService: OtpStorageService,
    private readonly resetTokenStorageService: ResetTokenStorageService,
  ) {}

  execute(command: VerifyResetOtpCommand): Promise<VerifyResetOtpResponseDto> {
    const { email, otp } = command;

    const validation = this.otpStorageService.validateOtp(email, otp);

    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    // OTP is valid, generate a password reset token
    const resetToken = this.resetTokenStorageService.generateResetToken();
    this.resetTokenStorageService.storeResetToken(email, resetToken);

    return Promise.resolve({
      resetToken,
      message: 'OTP verified successfully. You can now reset your password.',
    });
  }
}
