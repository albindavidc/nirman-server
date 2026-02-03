import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProjectCommand } from '../../../commands/project/create-project.command';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project-repository.interface';
import { ProjectMapper } from '../../../mappers/project.mapper';
import { ProjectResponseDto } from '../../../dto/project/project-response.dto';
import { ProjectStatus } from '../../../../domain/enums/project-status.enum';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(command: CreateProjectCommand): Promise<ProjectResponseDto> {
    const { data, createdBy } = command;

    const members =
      data.members?.map((m) => ({
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt ? new Date(m.joinedAt) : new Date(),
        isCreator: false,
      })) ?? [];

    // Add creator as member if not present
    const creatorIndex = members.findIndex((m) => m.userId === createdBy);
    if (creatorIndex === -1) {
      members.unshift({
        userId: createdBy,
        role: 'Admin',
        joinedAt: new Date(),
        isCreator: true,
      });
    } else {
      members[creatorIndex].isCreator = true;
    }

    const project = await this.projectRepository.create({
      name: data.name,
      managerIds: data.managerIds ?? [],
      description: data.description,
      icon: data.icon ?? 'folder',
      status: (data.status as unknown as ProjectStatus) ?? ProjectStatus.ACTIVE,
      progress: data.progress ?? 0,
      budget: data.budget,
      spent: data.spent,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      latitude: data.latitude,
      longitude: data.longitude,
      members: members,
    });

    return ProjectMapper.toResponse(project);
  }
}
