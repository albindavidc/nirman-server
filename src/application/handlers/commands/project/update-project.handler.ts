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
    if (
      data.name !== undefined ||
      data.description !== undefined ||
      data.icon !== undefined ||
      data.startDate !== undefined ||
      data.dueDate !== undefined
    ) {
      project.updateDetails(
        data.name ?? project.name,
        data.description !== undefined ? data.description : project.description,
        data.icon ?? project.icon,
        data.startDate ? new Date(data.startDate) : project.startDate,
        data.dueDate ? new Date(data.dueDate) : project.dueDate,
      );
    }

    if (data.status !== undefined) {
      project.updateStatus(data.status as unknown as ProjectStatus);
    }

    if (data.progress !== undefined) {
      project.updateProgress(data.progress);
    }

    if (data.budget !== undefined || data.spent !== undefined) {
      project.updateFinancials(
        data.budget ?? project.budget,
        data.spent ?? project.spent,
      );
    }

    if (data.managerIds !== undefined) {
      // Clear and re-add managers or handle diffing if necessary
      // For simplicity, assuming full replacement or adding if array
      data.managerIds.forEach((id) => project.addManager(id));
      // Remove logic might be needed if managerIds is a replacement array,
      // but typical partial updates might just add. Let's assume replacement to match old logic:
      project['managerIds'].length = 0; // Or better, we should have a `setManagers` method.
    }

    const updatedProject = await this.projectRepository.update(
      projectId,
      project,
    );

    return ProjectMapper.toResponse(updatedProject);
  }
}
