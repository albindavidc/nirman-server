import { Project } from '../../domain/entities/project.entity';
import {
  ProjectResponseDto,
  TeamMemberDto,
} from '../dto/project/project-response.dto';

export class ProjectMapper {
  static toResponse(
    project: Project,
    teamMembers: TeamMemberDto[] = [],
  ): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      icon: project.icon,
      status: project.status,
      progress: project.progress,
      budget: project.budget,
      spent: project.spent,
      startDate: project.startDate?.toISOString(),
      dueDate: project.dueDate?.toISOString(),
      teamMembers,
      createdBy: project.createdBy,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
