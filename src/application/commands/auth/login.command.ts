import { Command } from '@nestjs/cqrs';
import { LoginResult } from '../../handlers/commands/auth/login.handler';

export class LoginCommand extends Command<LoginResult> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
