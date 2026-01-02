import { Command } from '@nestjs/cqrs';
import { SendOtpDto } from '../../dto/otp/otp.dto';

export class SendOtpCommand extends Command<{
  success: boolean;
  message: string;
}> {
  constructor(public readonly dto: SendOtpDto) {
    super();
  }
}
