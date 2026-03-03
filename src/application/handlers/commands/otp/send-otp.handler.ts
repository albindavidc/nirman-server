import { Inject, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SendOtpCommand } from '../../../commands/otp/send-otp.command';
import {
  IEmailService,
  IOtpStorageService,
  EMAIL_SERVICE,
  OTP_STORAGE_SERVICE,
} from '../../../interfaces';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { Role } from '../../../../domain/enums/role.enum';
import { UserStatus } from '../../../../domain/enums/user-status.enum';
import { User } from '../../../../domain/entities/user.entity';

@CommandHandler(SendOtpCommand)
export class SendOtpHandler implements ICommandHandler<SendOtpCommand> {
  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
    @Inject(OTP_STORAGE_SERVICE)
    private readonly otpStorageService: IOtpStorageService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    command: SendOtpCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { dto } = command;
    const email = dto.email.toLowerCase();

    if (dto.isSignup && dto.role) {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        // Create new user with pending status
        // We need to cast role string to enum or validate it. Assuming it's valid for now or handled by service
        // Defaulting properties for new worker
        const newUser = new User({
          email,
          role: dto.role as Role,
          userStatus: UserStatus.INACTIVE, // or PENDING logic if exists
          isEmailVerified: false,
          isPhoneVerified: false,
          firstName: '', // Will be filled later or effectively empty
          lastName: '',
          passwordHash: 'temp', // Temporary placeholder
        });
        await this.userRepository.create(newUser);
      }
    }

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
