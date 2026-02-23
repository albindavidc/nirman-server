import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RemoveProjectWorkerCommand } from '../../../commands/project/remove-project-worker.command';
import {
  IProjectWorkerRepository,
  PROJECT_WORKER_REPOSITORY,
} from '../../../../domain/repositories/project-worker-repository.interface';

@CommandHandler(RemoveProjectWorkerCommand)
export class RemoveProjectWorkerHandler implements ICommandHandler<RemoveProjectWorkerCommand> {
  constructor(
    @Inject(PROJECT_WORKER_REPOSITORY)
    private readonly projectWorkerRepository: IProjectWorkerRepository,
  ) {}

  async execute(command: RemoveProjectWorkerCommand): Promise<{
    message: string;
    remainingWorkers: Array<{
      userId: string;
      role: string;
      joinedAt: Date;
      isCreator: boolean;
    }>;
  }> {
    const { projectId, userId } = command;

    const workers = await this.projectWorkerRepository.removeWorker(
      projectId,
      userId,
    );

    return {
      message: 'Worker removed successfully',
      remainingWorkers: workers.map((m) => ({
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt,
        isCreator: m.isCreator,
      })),
    };
  }
}
