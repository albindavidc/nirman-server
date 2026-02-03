import { Project } from '../../domain/entities/project.entity';
import {
  ProjectResponseDto,
  TeamMemberDto,
  ProjectMemberResponseDto,
} from '../dto/project/project-response.dto';

export class ProjectMapper {
  static toResponse(
    project: Project,
    teamMembers: TeamMemberDto[] = [],
  ): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      managerIds: project.managerIds,
      description: project.description,
      icon: project.icon,
      status: project.status,
      progress: project.progress,
      budget: project.budget,
      spent: project.spent,
      startDate: project.startDate?.toISOString(),
      dueDate: project.dueDate?.toISOString(),
      latitude: project.latitude,
      longitude: project.longitude,
      members:
        project.members?.map(
          (m): ProjectMemberResponseDto => ({
            userId: m.userId,
            role: m.role,
            joinedAt: m.joinedAt.toISOString(),
            isCreator: m.isCreator,
          }),
        ) ?? [],
      phases:
        project.phases?.map((p) => ({
          name: p.name,
          status: p.status,
          progress: p.progress,
          plannedStartDate: p.plannedStartDate?.toISOString(),
          plannedEndDate: p.plannedEndDate?.toISOString(),
          actualStartDate: p.actualStartDate?.toISOString(),
          actualEndDate: p.actualEndDate?.toISOString(),
        })) ?? [],
      teamMembers,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }
}
