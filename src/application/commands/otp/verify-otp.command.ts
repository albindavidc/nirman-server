import { Command } from '@nestjs/cqrs';
import { VerifyOtpDto } from '../../dto/otp/otp.dto';

export class VerifyOtpCommand extends Command<{
  verified: boolean;
  message: string;
}> {
  constructor(public readonly dto: VerifyOtpDto) {
    super();
  }
}
