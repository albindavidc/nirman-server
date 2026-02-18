import { Command } from '@nestjs/cqrs';
import { SupervisorSignupDto } from '../../dto/auth/supervisor-signup.dto';

export class SupervisorSignupCommand extends Command<{
  success: boolean;
  message: string;
}> {
  constructor(public readonly dto: SupervisorSignupDto) {
    super();
  }
}
