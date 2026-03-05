import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { DeleteProjectCommand } from '../../../commands/project/delete-project.command';
import {
  IProjectReader,
  PROJECT_READER,
} from '../../../../domain/repositories/project/project.reader.interface';
import {
  IProjectWriter,
  PROJECT_WRITER,
} from '../../../../domain/repositories/project/project.writer.interface';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectHandler implements ICommandHandler<DeleteProjectCommand> {
  constructor(
    @Inject(PROJECT_READER)
    private readonly projectReader: IProjectReader,
    @Inject(PROJECT_WRITER)
    private readonly projectWriter: IProjectWriter,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<void> {
    const { projectId } = command;

    const exists = await this.projectReader.existsById(projectId);
    if (!exists) {
      throw new NotFoundException('Project not found');
    }

    await this.projectWriter.softDelete(projectId);
  }
}
