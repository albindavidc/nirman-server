import { Project } from '../../domain/entities/project.entity';
import { ProjectMember } from '../../domain/types';
import { ProjectPhase } from '../../domain/entities/project-phase.entity';
import { ProjectStatus as DomainProjectStatus } from '../../domain/enums/project-status.enum';
import {
  ProjectPersistence,
  ProjectCreatePersistenceInput,
  ProjectUpdatePersistenceInput,
  ProjectWherePersistenceInput,
} from '../types/project.types';

/**
 * Type-safe mapper for Project entity <-> Prisma persistence conversion.
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
    // We map internal partial project to persistence input first
    const persistence = this.entityToPersistence(data);

    const { ...rest } = persistence;

    // Use a specific type for the base properties to ensure type safety
    const baseData = rest as Omit<ProjectCreatePersistenceInput, 'members'>;

    const createInput: ProjectCreatePersistenceInput = {
      ...baseData,
    };

    if (persistence.status) {
      createInput.status = persistence.status;
    }

    if (persistence.members) {
      // Map flat persistence members to Prisma Create structure
      createInput.members = {
        create: persistence.members,
      };
    }

    return createInput;
  }

  /**
   * Converts update input to Prisma-compatible format.
   */
  static toPrismaUpdateInput(
    data: Partial<Project>,
  ): ProjectUpdatePersistenceInput {
    const persistenceData = this.entityToPersistence(data);

    const updateData: ProjectUpdatePersistenceInput = {};

    // Map scalar fields
    if (persistenceData.name !== undefined)
      updateData.name = persistenceData.name;
    if (persistenceData.description !== undefined)
      updateData.description = persistenceData.description;
    if (persistenceData.manager_ids !== undefined)
      updateData.manager_ids = persistenceData.manager_ids;
    if (persistenceData.icon !== undefined)
      updateData.icon = persistenceData.icon;
    if (persistenceData.status !== undefined)
      updateData.status = persistenceData.status;
    if (persistenceData.progress !== undefined)
      updateData.progress = persistenceData.progress;
    if (persistenceData.budget !== undefined)
      updateData.budget = persistenceData.budget;
    if (persistenceData.spent !== undefined)
      updateData.spent = persistenceData.spent;
    if (persistenceData.start_date !== undefined)
      updateData.start_date = persistenceData.start_date;
    if (persistenceData.due_date !== undefined)
      updateData.due_date = persistenceData.due_date;
    if (persistenceData.latitude !== undefined)
      updateData.latitude = persistenceData.latitude;
    if (persistenceData.longitude !== undefined)
      updateData.longitude = persistenceData.longitude;
    if (persistenceData.is_deleted !== undefined)
      updateData.is_deleted = persistenceData.is_deleted;
    if (persistenceData.deleted_at !== undefined)
      updateData.deleted_at = persistenceData.deleted_at;

    // Map relations if any (currently members logic in create, for update usually specific logic applies)
    // The previous implementation filtered out phases.

    return updateData;
  }

  /**
   * Converts where input to Prisma-compatible format.
   */
  static toPrismaWhereInput(
    where: ProjectWherePersistenceInput,
  ): ProjectWherePersistenceInput {
    const prismaWhere: ProjectWherePersistenceInput = {};

    if (where.id) prismaWhere.id = where.id;
    if (where.is_deleted !== undefined)
      prismaWhere.is_deleted = where.is_deleted;
    if (where.status) prismaWhere.status = where.status;

    if (where.OR) {
      prismaWhere.OR = where.OR.map((cond) => ({ ...cond }));
    }

    if (where.members) {
      if (where.members.some) {
        prismaWhere.members = {
          some: {
            user_id: where.members.some.user_id,
            is_creator: where.members.some.is_creator,
          },
        };
      }
    }

    return prismaWhere;
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
      status: prismaProject.status as unknown as DomainProjectStatus,
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
  ): Partial<ProjectPersistence> {
    const data: Partial<ProjectPersistence> = {};

    if (entity.name !== undefined) data.name = entity.name;
    if (entity.managerIds !== undefined) data.manager_ids = entity.managerIds;
    if (entity.description !== undefined)
      data.description = entity.description ?? undefined;
    if (entity.icon !== undefined) data.icon = entity.icon;
    if (entity.status !== undefined)
      data.status = entity.status as unknown as ProjectPersistence['status'];
    if (entity.progress !== undefined) data.progress = entity.progress;
    if (entity.budget !== undefined) data.budget = entity.budget;
    if (entity.spent !== undefined) data.spent = entity.spent;
    if (entity.startDate !== undefined) data.start_date = entity.startDate;
    if (entity.dueDate !== undefined) data.due_date = entity.dueDate;
    if (entity.members !== undefined) {
      data.members = entity.members.map((m) => ({
        user_id: m.userId,
        role: m.role,
        joined_at: m.joinedAt,
        is_creator: m.isCreator,
      }));
    }

    return data;
  }
}
