import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { SendOtpCommand } from 'src/application/command/send-otp.command';
import { EmailService } from 'src/infrastructure/services/email.service';
import { OtpStorageService } from 'src/infrastructure/services/otp-storage.service';

@CommandHandler(SendOtpCommand)
export class SendOtpHandler implements ICommandHandler<SendOtpCommand> {
  constructor(
    private readonly emailService: EmailService,
    private readonly otpStorageService: OtpStorageService,
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
