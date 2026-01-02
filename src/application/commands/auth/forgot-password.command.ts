import { Command } from '@nestjs/cqrs';

export class ForgotPasswordCommand extends Command<{ message: string }> {
  constructor(public readonly email: string) {
    super();
  }
}
