import { Command } from '@nestjs/cqrs';

export class UpdatePasswordCommand extends Command<{ message: string }> {
  constructor(
    public readonly userId: string,
    public readonly currentPassword: string,
    public readonly newPassword: string,
  ) {
    super();
  }
}
