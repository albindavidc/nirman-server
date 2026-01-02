import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { VerifyResetOtpCommand } from '../../../commands/auth/verify-reset-otp.command';
import {
  IOtpStorageService,
  IResetTokenStorageService,
  OTP_STORAGE_SERVICE,
  RESET_TOKEN_STORAGE_SERVICE,
} from '../../../../application/interfaces/services';
import { VerifyResetOtpResponseDto } from '../../../dto/auth/verify-reset-otp.dto';

@CommandHandler(VerifyResetOtpCommand)
export class VerifyResetOtpHandler implements ICommandHandler<VerifyResetOtpCommand> {
  constructor(
    @Inject(OTP_STORAGE_SERVICE)
    private readonly otpStorageService: IOtpStorageService,
    @Inject(RESET_TOKEN_STORAGE_SERVICE)
    private readonly resetTokenStorageService: IResetTokenStorageService,
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
