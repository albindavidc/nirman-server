import { Project } from '../../../../domain/entities/project.entity';
import { ProjectMember } from '../../../../domain/types';
import { ProjectPhase } from '../../../../domain/entities/project-phase.entity';
import { ProjectStatus } from '../../../../domain/enums/project-status.enum';
import {
  ProjectPersistence,
  ProjectMemberPersistence,
} from './project.persistence';

export class ProjectMapper {
  static persistenceToEntity(prismaProject: ProjectPersistence): Project {
    return new Project({
      id: prismaProject.id,
      name: prismaProject.name,
      managerIds: prismaProject.manager_ids ?? [],
      description:
        prismaProject.description !== null
          ? prismaProject.description
          : undefined,
      icon: prismaProject.icon,
      status: prismaProject.status as ProjectStatus,
      progress: prismaProject.progress,
      budget: prismaProject.budget ?? undefined,
      spent: prismaProject.spent ?? undefined,
      startDate: prismaProject.start_date ?? undefined,
      dueDate: prismaProject.due_date ?? undefined,
      latitude: prismaProject.latitude ?? undefined,
      longitude: prismaProject.longitude ?? undefined,
      members:
        (prismaProject.members as ProjectMemberPersistence[] | undefined)?.map(
          (m): ProjectMember => ({
            userId: m.user_id,
            role: m.role,
            joinedAt: m.joined_at,
            isCreator: m.is_creator,
          }),
        ) ?? [],
      phases:
        prismaProject.phases?.map(
          (p) =>
            new ProjectPhase(
              p.id,
              p.project_id,
              p.name,
              p.description,
              p.progress,
              p.planned_start_date,
              p.planned_end_date,
              p.actual_start_date,
              p.actual_end_date,
              p.status,
              p.sequence,
              p.created_at,
              p.updated_at,
            ),
        ) ?? [],
      createdAt: prismaProject.created_at,
      updatedAt: prismaProject.updated_at,
    });
  }

  static entityToPersistence(
    entity: Partial<Project>,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {};

    if (entity.id !== undefined) data.id = entity.id;
    if (entity.name !== undefined) data.name = entity.name;
    if (entity.managerIds !== undefined) data.manager_ids = entity.managerIds;
    if (entity.description !== undefined) data.description = entity.description;
    if (entity.icon !== undefined) data.icon = entity.icon;
    if (entity.status !== undefined) data.status = entity.status;
    if (entity.progress !== undefined) data.progress = entity.progress;
    if (entity.budget !== undefined) data.budget = entity.budget;
    if (entity.spent !== undefined) data.spent = entity.spent;
    if (entity.startDate !== undefined) data.start_date = entity.startDate;
    if (entity.dueDate !== undefined) data.due_date = entity.dueDate;
    if (entity.latitude !== undefined) data.latitude = entity.latitude;
    if (entity.longitude !== undefined) data.longitude = entity.longitude;
    if (entity.members !== undefined) {
      data.members = entity.members.map((m) => ({
        user_id: m.userId,
        role: m.role,
        joined_at: m.joinedAt,
        is_creator: m.isCreator,
      }));
    }
    if (entity.createdAt !== undefined) data.created_at = entity.createdAt;
    if (entity.updatedAt !== undefined) data.updated_at = entity.updatedAt;

    return data;
  }
}
