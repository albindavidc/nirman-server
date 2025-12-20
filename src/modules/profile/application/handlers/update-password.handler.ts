import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { UpdatePasswordCommand } from '../commands/update-password.command';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/repositories/user-repository.interface';

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler implements ICommandHandler<UpdatePasswordCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: UpdatePasswordCommand): Promise<{ message: string }> {
    const { userId, currentPassword, newPassword } = command;

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await argon2.verify(
      user.password_hash,
      currentPassword,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await argon2.hash(newPassword);

    // Update password
    await this.userRepository.updatePassword(user.email, newPasswordHash);

    return { message: 'Password updated successfully' };
  }
}
