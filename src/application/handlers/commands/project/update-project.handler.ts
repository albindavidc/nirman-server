import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProjectCommand } from '../../../commands/project/update-project.command';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project-repository.interface';
import { ProjectMapper } from '../../../mappers/project.mapper';
import { ProjectResponseDto } from '../../../dto/project/project-response.dto';
import { ProjectStatus } from '../../../../domain/enums/project-status.enum';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectHandler implements ICommandHandler<UpdateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<ProjectResponseDto> {
    const { projectId, data } = command;

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Map modifications
    if (data.name) project.name = data.name;
    if (data.description !== undefined) project.description = data.description;
    if (data.icon) project.icon = data.icon;
    if (data.status) project.status = data.status as unknown as ProjectStatus;
    if (data.progress !== undefined) project.progress = data.progress;
    if (data.budget !== undefined) project.budget = data.budget;
    if (data.spent !== undefined) project.spent = data.spent;
    if (data.startDate) project.startDate = new Date(data.startDate);
    if (data.dueDate) project.dueDate = new Date(data.dueDate);
    if (data.teamMemberIds) project.teamMemberIds = data.teamMemberIds;

    const updatedProject = await this.projectRepository.update(
      projectId,
      project,
    );

    return ProjectMapper.toResponse(updatedProject);
  }
}
