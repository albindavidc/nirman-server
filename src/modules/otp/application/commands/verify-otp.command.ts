import { VerifyOtpDto } from '../dto/otp.dto';

export class VerifyOtpCommand {
  constructor(public readonly dto: VerifyOtpDto) {}
}
