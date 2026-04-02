import { Project } from '../../domain/entities/project.entity';
import { ProjectWorker } from '../../domain/types';
import { ProjectPhase } from '../../domain/entities/project-phase.entity';
import { ProjectStatus as DomainProjectStatus } from '../../domain/enums/project-status.enum';
import {
  ProjectResponseDto,
  TeamMemberDto,
  ProjectWorkerResponseDto,
} from '../dto/project/project-response.dto';
import {
  ProjectPersistence,
  ProjectCreatePersistenceInput,
  ProjectUpdatePersistenceInput,
  ProjectWherePersistenceInput,
} from '../../infrastructure/types/project.types';

/**
 * Type-safe mapper for Project entity <-> Prisma persistence conversion & Response mapping.
 */
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
      workers:
        project.workers?.map(
          (m): ProjectWorkerResponseDto => ({
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

  /**
   * Converts a Prisma result to domain entity.
   */
  static fromPrismaResult<T extends Record<string, any>>(result: T): Project {
    return this.persistenceToEntity(result as unknown as ProjectPersistence);
  }

  /**
   * Converts a Prisma result array to domain entities.
   */
  static fromPrismaResults<T extends Record<string, any>>(
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
      createInput.members = {
        create: persistence.members.map((m) => ({
          userId: m.userId,
          role: this.mapToPrismaRole(m.role),
          joinedAt: m.joinedAt,
          isCreator: m.isCreator,
        })),
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
    if (persistenceData.managerIds !== undefined)
      updateData.managerIds = persistenceData.managerIds;
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
    if (persistenceData.startDate !== undefined)
      updateData.startDate = persistenceData.startDate;
    if (persistenceData.dueDate !== undefined)
      updateData.dueDate = persistenceData.dueDate;
    if (persistenceData.latitude !== undefined)
      updateData.latitude = persistenceData.latitude;
    if (persistenceData.longitude !== undefined)
      updateData.longitude = persistenceData.longitude;
    if (persistenceData.isDeleted !== undefined)
      updateData.isDeleted = persistenceData.isDeleted;
    if (persistenceData.deletedAt !== undefined)
      updateData.deletedAt = persistenceData.deletedAt;

    if (persistenceData.members) {
      updateData.members = {
        set: persistenceData.members.map((m) => ({
          userId: m.userId,
          role: this.mapToPrismaRole(m.role) as any,
          joinedAt: m.joinedAt,
          isCreator: m.isCreator,
        })),
      } as any;
    }

    return updateData;
  }

  private static mapToPrismaRole(role: string): string {
    const r = role?.toLowerCase();
    switch (r) {
      case 'admin':
      case 'manager':
        return 'manager';
      case 'supervisor':
      case 'foreman':
        return 'supervisor';
      case 'worker':
      case 'engineer':
      case 'technician':
        return 'engineer';
      default:
        return 'engineer';
    }
  }

  /**
   * Converts where input to Prisma-compatible format.
   */
  static toPrismaWhereInput(
    where: ProjectWherePersistenceInput,
  ): ProjectWherePersistenceInput {
    const prismaWhere: ProjectWherePersistenceInput = {};

    if (where.id) prismaWhere.id = where.id;
    if (where.isDeleted !== undefined)
      prismaWhere.isDeleted = where.isDeleted;
    if (where.status) prismaWhere.status = where.status;

    if (where.OR) {
      prismaWhere.OR = where.OR.map((cond) => ({ ...cond }));
    }

    if (where.members?.some) {
      prismaWhere.members = {
        array_contains: [
          {
            userId: where.members.some.userId,
            isCreator: where.members.some.isCreator,
          },
        ].filter(
          (v) => v.userId !== undefined || v.isCreator !== undefined,
        ),
      };
    }

    return prismaWhere;
  }

  static persistenceToEntity(prismaProject: ProjectPersistence): Project {
    return new Project({
      id: prismaProject.id,
      name: prismaProject.name,
      managerIds: prismaProject.managerIds ?? [],
      description:
        prismaProject.description !== null
          ? prismaProject.description
          : undefined,
      icon: prismaProject.icon,
      status: prismaProject.status as unknown as DomainProjectStatus,
      progress: prismaProject.progress,
      budget: prismaProject.budget ?? undefined,
      spent: prismaProject.spent ?? undefined,
      startDate: prismaProject.startDate ?? undefined,
      dueDate: prismaProject.dueDate ?? undefined,
      latitude: prismaProject.latitude ?? undefined,
      longitude: prismaProject.longitude ?? undefined,
      workers:
        prismaProject.members?.map(
          (m): ProjectWorker => ({
            userId: m.userId,
            role: m.role,
            joinedAt:
              m.joinedAt instanceof Date
                ? m.joinedAt
                : new Date(m.joinedAt),
            isCreator: m.isCreator,
          }),
        ) ?? [],
      phases:
        prismaProject.phases?.map(
          (p) =>
            new ProjectPhase(
              p.id,
              p.projectId,
              p.name,
              p.description,
              p.progress,
              p.plannedStartDate,
              p.plannedEndDate,
              p.actualStartDate,
              p.actualEndDate,
              p.status,
              p.sequence,
              p.createdAt,
              p.updatedAt,
            ),
        ) ?? [],
      createdAt: prismaProject.createdAt,
      updatedAt: prismaProject.updatedAt,
    });
  }

  static entityToPersistence(
    entity: Partial<Project>,
  ): Partial<ProjectPersistence> {
    const data: Partial<ProjectPersistence> = {};

    if (entity.name !== undefined) data.name = entity.name;
    if (entity.managerIds !== undefined) data.managerIds = entity.managerIds;
    if (entity.description !== undefined)
      data.description = entity.description ?? undefined;
    if (entity.icon !== undefined) data.icon = entity.icon;
    if (entity.status !== undefined)
      data.status = entity.status as unknown as ProjectPersistence['status'];
    if (entity.progress !== undefined) data.progress = entity.progress;
    if (entity.budget !== undefined) data.budget = entity.budget;
    if (entity.spent !== undefined) data.spent = entity.spent;
    if (entity.startDate !== undefined) data.startDate = entity.startDate;
    if (entity.dueDate !== undefined) data.dueDate = entity.dueDate;
    if (entity.workers !== undefined) {
      data.members = entity.workers.map((m) => ({
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt,
        isCreator: m.isCreator,
      }));
    }

    return data;
  }
}
