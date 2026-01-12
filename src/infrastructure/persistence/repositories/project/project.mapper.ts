import { Project } from '../../../../domain/entities/project.entity';
import { ProjectStatus } from '../../../../domain/enums/project-status.enum';
import { ProjectPersistenceWithCreator } from './project.persistence';

export class ProjectMapper {
  static persistenceToEntity(
    prismaProject: ProjectPersistenceWithCreator,
  ): Project {
    return new Project({
      id: prismaProject.id,
      name: prismaProject.name,
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
      teamMemberIds: prismaProject.team_member_ids,
      createdBy: prismaProject.created_by,
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
    if (entity.description !== undefined) data.description = entity.description;
    if (entity.icon !== undefined) data.icon = entity.icon;
    if (entity.status !== undefined) data.status = entity.status;
    if (entity.progress !== undefined) data.progress = entity.progress;
    if (entity.budget !== undefined) data.budget = entity.budget;
    if (entity.spent !== undefined) data.spent = entity.spent;
    if (entity.startDate !== undefined) data.start_date = entity.startDate;
    if (entity.dueDate !== undefined) data.due_date = entity.dueDate;
    if (entity.teamMemberIds !== undefined)
      data.team_member_ids = entity.teamMemberIds;
    if (entity.createdBy !== undefined) data.created_by = entity.createdBy;
    if (entity.createdAt !== undefined) data.created_at = entity.createdAt;
    if (entity.updatedAt !== undefined) data.updated_at = entity.updatedAt;

    return data;
  }
}
