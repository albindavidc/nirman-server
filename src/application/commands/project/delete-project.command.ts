import { Command } from '@nestjs/cqrs';

export class DeleteProjectCommand extends Command<void> {
  constructor(public readonly projectId: string) {
    super();
  }
}
