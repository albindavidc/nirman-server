import { Command } from '@nestjs/cqrs';

export class ResetPasswordCommand extends Command<{ message: string }> {
  constructor(
    public readonly email: string,
    public readonly resetToken: string,
    public readonly newPassword: string,
  ) {
    super();
  }
}
