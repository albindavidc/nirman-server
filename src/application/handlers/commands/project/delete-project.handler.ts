import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteProjectCommand } from '../../../commands/project/delete-project.command';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project-repository.interface';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<void> {
    const { projectId } = command;

    const exists = await this.projectRepository.exists(projectId);
    if (!exists) {
      throw new NotFoundException('Project not found');
    }

    await this.projectRepository.delete(projectId);
  }
}
