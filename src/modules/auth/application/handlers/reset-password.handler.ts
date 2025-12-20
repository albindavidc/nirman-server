import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ResetPasswordCommand } from '../commands/reset-password.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';
import { ResetTokenStorageService } from 'src/modules/auth/infrastructure/services/reset-token-storage.service';

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler implements ICommandHandler<ResetPasswordCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
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
