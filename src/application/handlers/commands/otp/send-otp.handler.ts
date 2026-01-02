import { Inject, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendOtpCommand } from '../../../commands/otp/send-otp.command';
import {
  IEmailService,
  IOtpStorageService,
  EMAIL_SERVICE,
  OTP_STORAGE_SERVICE,
} from '../../../../application/interfaces/services';

@CommandHandler(SendOtpCommand)
export class SendOtpHandler implements ICommandHandler<SendOtpCommand> {
  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
    @Inject(OTP_STORAGE_SERVICE)
    private readonly otpStorageService: IOtpStorageService,
  ) {}

  async execute(
    command: SendOtpCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { dto } = command;
    const email = dto.email.toLowerCase();

    // Generate and store OTP
    const otp = this.otpStorageService.generateOtp();
    this.otpStorageService.storeOtp(email, otp);

    // Send OTP via email
    const sent = await this.emailService.sendOtpEmail(email, otp);

    if (!sent) {
      throw new BadRequestException('Failed to send OTP email');
    }

    return { success: true, message: 'OTP sent successfully' };
  }
}
