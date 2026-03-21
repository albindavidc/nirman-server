import { Command } from '@nestjs/cqrs';

export class UpdateProjectWorkerCommand extends Command<void> {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly role: string,
  ) {
    super();
  }
}
