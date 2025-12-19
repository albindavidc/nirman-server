import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { VerifyOtpCommand } from 'src/modules/otp/application/commands/verify-otp.command';
import { OtpStorageService } from 'src/modules/otp/infrastructure/services/otp-storage.service';
import { PrismaService } from 'src/prisma/prisma.service';

@CommandHandler(VerifyOtpCommand)
export class VerifyOtpHandler implements ICommandHandler<VerifyOtpCommand> {
  constructor(
    private readonly otpStorageService: OtpStorageService,
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
