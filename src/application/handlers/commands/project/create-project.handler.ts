import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProjectCommand } from '../../../commands/project/create-project.command';
import {
  IProjectWriter,
  PROJECT_WRITER,
} from '../../../../domain/repositories/project/project.writer.interface';
import { Project } from '../../../../domain/entities/project.entity';
import { ProjectMapper } from '../../../mappers/project.mapper';
import { ProjectResponseDto } from '../../../dto/project/project-response.dto';
import { ProjectStatus } from '../../../../domain/enums/project-status.enum';
import { ProjectRole } from '../../../../domain/enums/project-role.enum';

@CommandHandler(CreateProjectCommand)
export class CreateProjectHandler implements ICommandHandler<CreateProjectCommand> {
  constructor(
    @Inject(PROJECT_WRITER)
    private readonly projectWriter: IProjectWriter,
  ) {}

  async execute(command: CreateProjectCommand): Promise<ProjectResponseDto> {
    const { data, createdBy } = command;

    const workers =
      data.workers?.map((m) => ({
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt ? new Date(m.joinedAt) : new Date(),
        isCreator: false,
      })) ?? [];

    // Add creator as worker if not present
    const creatorIndex = workers.findIndex((m) => m.userId === createdBy);
    if (creatorIndex === -1) {
      workers.unshift({
        userId: createdBy,
        role: ProjectRole.ADMIN,
        joinedAt: new Date(),
        isCreator: true,
      });
    } else {
      workers[creatorIndex].isCreator = true;
    }

    const newProject = new Project({
      name: data.name,
      managerIds: data.managerIds ?? [],
      description: data.description,
      icon: data.icon ?? 'folder',
      status: (data.status as ProjectStatus | undefined) ?? ProjectStatus.ACTIVE,
      progress: data.progress ?? 0,
      budget: data.budget,
      spent: data.spent,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      latitude: data.latitude,
      longitude: data.longitude,
      workers: workers,
    });

    const project = await this.projectWriter.save(newProject);

    return ProjectMapper.toResponse(project);
  }
}
