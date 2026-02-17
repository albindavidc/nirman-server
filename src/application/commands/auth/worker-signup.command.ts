import { Command } from '@nestjs/cqrs';
import { WorkerSignupDto } from '../../dto/auth/worker-signup.dto';

export class WorkerSignupCommand extends Command<{
  success: boolean;
  message: string;
}> {
  constructor(public readonly dto: WorkerSignupDto) {
    super();
  }
}
