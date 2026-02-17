import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkerSignupCommand } from '../../../commands/auth/worker-signup.command';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { Role } from '../../../../domain/enums/role.enum';
import { UserStatus } from '../../../../domain/enums/user-status.enum';
import { BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import * as argon2 from 'argon2';

@CommandHandler(WorkerSignupCommand)
export class WorkerSignupHandler implements ICommandHandler<WorkerSignupCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    command: WorkerSignupCommand,
  ): Promise<{ success: boolean; message: string }> {
    const { email, password, confirmPassword } = command.dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(
        'User not found. Please contact your administrator.',
      );
    }

    if (user.role !== Role.WORKER) {
      throw new BadRequestException(
        'Invalid user role for this signup endpoint.',
      );
    }

    // Hash password
    // Hash password
    const passwordHash = await argon2.hash(password);

    // Update user password
    await this.userRepository.updatePassword(email, passwordHash);

    // Update user status to ACTIVE
    if (user.id) {
      await this.userRepository.update(user.id, {
        userStatus: UserStatus.ACTIVE,
      });
    }

    return { success: true, message: 'Account activated successfully' };
  }
}
