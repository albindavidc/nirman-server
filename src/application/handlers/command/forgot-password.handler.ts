import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { ForgotPasswordCommand } from '../../command/forgot-password.command';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { OtpStorageService } from 'src/infrastructure/services/otp-storage.service';
import { EmailService } from 'src/infrastructure/services/email.service';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpStorageService: OtpStorageService,
    private readonly emailService: EmailService,
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<{ message: string }> {
    const { email } = command;

    // Check if user exists
    const userPersistence = await this.userRepository.findByEmail(
      email.toLowerCase(),
    );

    if (!userPersistence) {
      // Don't reveal if email exists or not for security
      return { message: 'If the email exists, a reset code has been sent.' };
    }

    // Generate OTP
    const otp = this.otpStorageService.generateOtp();

    // Store OTP
    this.otpStorageService.storeOtp(email, otp);

    // Send email with OTP
    await this.emailService.sendPasswordResetEmail(email, otp);

    return { message: 'If the email exists, a reset code has been sent.' };
  }
}
