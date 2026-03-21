import { Command } from '@nestjs/cqrs';

export class RemoveProjectWorkerCommand extends Command<{
  message: string;
  remainingWorkers: any[];
}> {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
  ) {
    super();
  }
}
