import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProjectWorkerCommand } from '../../../commands/project/update-project-worker.command';
import {
  IProjectWorkerWriter,
  PROJECT_WORKER_WRITER,
} from '../../../../domain/repositories/project/project-worker.writer.interface';

@CommandHandler(UpdateProjectWorkerCommand)
export class UpdateProjectWorkerHandler implements ICommandHandler<UpdateProjectWorkerCommand> {
  constructor(
    @Inject(PROJECT_WORKER_WRITER)
    private readonly projectWorkerRepository: IProjectWorkerWriter,
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
