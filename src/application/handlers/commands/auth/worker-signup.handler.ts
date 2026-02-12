import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WorkerSignupCommand } from '../../../commands/auth/worker-signup.command';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '../../../../domain/repositories/user-repository.interface';
import { Role } from '../../../../domain/enums/role.enum';
import { BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@CommandHandler(WorkerSignupCommand)
export class WorkerSignupHandler implements ICommandHandler<WorkerSignupCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: WorkerSignupCommand): Promise<void> {
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
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);

    // Update user password and status
    // Assuming status logic is handled by password presence or explicit field
    // For now, we update the password hash which activates the account access
    await this.userRepository.updatePassword(email, passwordHash);

    // Optionally update status to 'active' if such field exists and needed
    // await this.userRepository.update(user.id, { status: 'active' });
  }
}
