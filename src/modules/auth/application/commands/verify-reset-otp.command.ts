import { Command } from '@nestjs/cqrs';
import { VerifyResetOtpResponseDto } from '../dto/verify-reset-otp.dto';

export class VerifyResetOtpCommand extends Command<VerifyResetOtpResponseDto> {
  constructor(
    public readonly email: string,
    public readonly otp: string,
  ) {
    super();
  }
}
