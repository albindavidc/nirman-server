import { SendOtpDto } from '../dto/otp.dto';

export class SendOtpCommand {
  constructor(public readonly dto: SendOtpDto) {}
}
