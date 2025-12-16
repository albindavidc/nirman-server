import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { VerifyResetOtpCommand } from '../../command/verify-reset-otp.command';
import { OtpStorageService } from 'src/infrastructure/services/otp-storage.service';
import { ResetTokenStorageService } from 'src/infrastructure/services/reset-token-storage.service';
import { VerifyResetOtpResponseDto } from '../../dto/verify-reset-otp.dto';

@CommandHandler(VerifyResetOtpCommand)
export class VerifyResetOtpHandler implements ICommandHandler<VerifyResetOtpCommand> {
  constructor(
    private readonly otpStorageService: OtpStorageService,
    private readonly resetTokenStorageService: ResetTokenStorageService,
  ) {}

  async execute(
    command: VerifyResetOtpCommand,
  ): Promise<VerifyResetOtpResponseDto> {
    const { email, otp } = command;

    // Validate OTP
    const validation = this.otpStorageService.validateOtp(email, otp);

    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    // Generate reset token for password change
    const resetToken = this.resetTokenStorageService.generateResetToken();

    // Store reset token
    this.resetTokenStorageService.storeResetToken(email, resetToken);

    return {
      resetToken,
      message:
        'OTP verified successfully. Use the reset token to set your new password.',
    };
  }
}
