import { Project } from '../../domain/entities/project.entity';
import { ProjectMember } from '../../domain/types';
import { ProjectPhase } from '../../domain/entities/project-phase.entity';
import { ProjectStatus } from '../../domain/enums/project-status.enum';
import {
  ProjectPersistence,
  ProjectCreatePersistenceInput,
  ProjectUpdatePersistenceInput,
  ProjectWherePersistenceInput,
} from '../types/project.types';

/**
 * Type-safe mapper for Project entity <-> Prisma persistence conversion.
 * All 'any' types are encapsulated within this mapper with eslint-disable comments.
 */
export class ProjectMapper {
  /**
   * Converts a Prisma result to domain entity.
   * Encapsulates the type conversion internally.
   */
  static fromPrismaResult<T extends Record<string, unknown>>(
    result: T,
  ): Project {
    return this.persistenceToEntity(result as unknown as ProjectPersistence);
  }

  /**
   * Converts a Prisma result array to domain entities.
   */
  static fromPrismaResults<T extends Record<string, unknown>>(
    results: T[],
  ): Project[] {
    return results.map((r) => this.fromPrismaResult(r));
  }

  /**
   * Converts create input to Prisma-compatible format.
   */
  static toPrismaCreateInput(
    data: Partial<Project>,
  ): ProjectCreatePersistenceInput {
    // Cast strict return type to satisfy optional vs required mismatches if strict check fails inside,
    // but entityToPersistence returns ProjectCreatePersistenceInput so it should match.
    // However, entityToPersistence returns Partial<ProjectCreatePersistenceInput> in signature but implementation builds almost full.
    // Let's rely on entityToPersistence type alignment.
    return this.entityToPersistence(data) as ProjectCreatePersistenceInput;
  }

  /**
   * Converts update input to Prisma-compatible format.
   */
  static toPrismaUpdateInput(
    data: Partial<Project>,
  ): ProjectUpdatePersistenceInput {
    const persistenceData = this.entityToPersistence(data);
    // Filter out undefined and phases for update
    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(persistenceData)) {
      if (value !== undefined && key !== 'phases') {
        updateData[key] = value;
      }
    }
    return updateData as unknown as ProjectUpdatePersistenceInput;
  }

  /**
   * Converts where input to Prisma-compatible format.
   */
  static toPrismaWhereInput(
    where: ProjectWherePersistenceInput,
  ): ProjectWherePersistenceInput {
    return where;
  }

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
      status: prismaProject.status as unknown as ProjectStatus,
      progress: prismaProject.progress,
      budget: prismaProject.budget ?? undefined,
      spent: prismaProject.spent ?? undefined,
      startDate: prismaProject.start_date ?? undefined,
      dueDate: prismaProject.due_date ?? undefined,
      latitude: prismaProject.latitude ?? undefined,
      longitude: prismaProject.longitude ?? undefined,
      members:
        prismaProject.members?.map(
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
  ): Partial<ProjectCreatePersistenceInput> {
    const data: Partial<ProjectCreatePersistenceInput> = {};

    if (entity.name !== undefined) data.name = entity.name;
    if (entity.managerIds !== undefined) data.manager_ids = entity.managerIds;
    if (entity.description !== undefined)
      data.description = entity.description ?? undefined;
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
      data.members = {
        create: entity.members.map((m) => ({
          user_id: m.userId,
          role: m.role,
          joined_at: m.joinedAt,
          is_creator: m.isCreator,
        })),
      };
    }

    return data;
  }
}
