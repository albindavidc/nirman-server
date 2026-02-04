import { Inject, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyOtpCommand } from '../../../commands/otp/verify-otp.command';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { IOtpStorageService, OTP_STORAGE_SERVICE } from '../../../interfaces';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(
    @Inject(OTP_STORAGE_SERVICE)
    private readonly otpStorageService: IOtpStorageService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    command: VerifyOtpCommand,
  ): Promise<{ verified: boolean; message: string }> {
    const { dto } = command;
    const email = dto.email.toLowerCase();

    const result = this.otpStorageService.validateOtp(email, dto.otp);

    if (!result.valid) {
      throw new BadRequestException(result.message);
    }

    // Update is_email_verified to true after successful OTP verification
    await this.prisma.user.update({
      where: { email },
      data: { is_email_verified: true },
    });

    return { verified: true, message: result.message };
  }
}
