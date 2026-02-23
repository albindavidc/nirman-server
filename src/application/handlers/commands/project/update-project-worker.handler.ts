import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProjectWorkerCommand } from '../../../commands/project/update-project-worker.command';
import {
  IProjectWorkerRepository,
  PROJECT_WORKER_REPOSITORY,
} from '../../../../domain/repositories/project-worker-repository.interface';

@CommandHandler(UpdateProjectWorkerCommand)
export class UpdateProjectWorkerHandler implements ICommandHandler<UpdateProjectWorkerCommand> {
  constructor(
    @Inject(PROJECT_WORKER_REPOSITORY)
    private readonly projectWorkerRepository: IProjectWorkerRepository,
  ) {}

  async execute(command: UpdateProjectWorkerCommand): Promise<void> {
    const { projectId, userId, role } = command;

    await this.projectWorkerRepository.updateWorkerRole(
      projectId,
      userId,
      role,
    );
  }
}
