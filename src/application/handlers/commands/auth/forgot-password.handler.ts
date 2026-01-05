import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ForgotPasswordCommand } from '../../../commands/auth/forgot-password.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import {
  IOtpStorageService,
  IEmailService,
  OTP_STORAGE_SERVICE,
  EMAIL_SERVICE,
} from '../../../interfaces';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(OTP_STORAGE_SERVICE)
    private readonly otpStorageService: IOtpStorageService,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
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
