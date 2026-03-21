import { Command } from '@nestjs/cqrs';

export class AddProjectWorkerCommand extends Command<{
  message: string;
  addedCount: number;
  workers: any[];
}> {
  constructor(
    public readonly projectId: string,
    public readonly userIds: string[],
    public readonly role: string,
  ) {
    super();
  }
}
