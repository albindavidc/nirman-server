import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResetPasswordCommand } from '../../command/reset-password.command';
import { UserRepository } from 'src/infrastructure/repositories/user.repository';
import { ResetTokenStorageService } from 'src/infrastructure/services/reset-token-storage.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly resetTokenStorageService: ResetTokenStorageService,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<{ message: string }> {
    const { email, resetToken, newPassword } = command;

    // Validate reset token
    const validation = this.resetTokenStorageService.validateResetToken(
      email,
      resetToken,
    );

    if (!validation.valid) {
      throw new BadRequestException(validation.message);
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password in database
    await this.userRepository.updatePassword(email, passwordHash);

    return {
      message:
        'Password has been reset successfully. You can now login with your new password.',
    };
  }
}
