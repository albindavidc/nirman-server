import { ProjectPhase } from '../../domain/entities/project-phase.entity';
import {
  Prisma,
  ProjectPhase as PrismaProjectPhase,
} from '../../generated/client/client';
import { ProjectPhaseDto } from '../dto/project/phase/project-phase.dto';

export class ProjectPhaseMapper {
  static toDomain(persistence: PrismaProjectPhase): ProjectPhase {
    return new ProjectPhase(
      persistence.id,
      persistence.project_id,
      persistence.name,
      persistence.description,
      persistence.progress,
      persistence.planned_start_date,
      persistence.planned_end_date,
      persistence.actual_start_date,
      persistence.actual_end_date,
      persistence.status,
      persistence.sequence,
      persistence.created_at,
      persistence.updated_at,
    );
  }

  static toCreateInput(domain: ProjectPhase): Prisma.ProjectPhaseCreateInput {
    // Prisma will generate an id if none is supplied; avoid passing an empty string
    const input: any = {
      project: { connect: { id: domain.projectId } },
      name: domain.name,
      description: domain.description,
      progress: domain.progress,
      planned_start_date: domain.plannedStartDate,
      planned_end_date: domain.plannedEndDate,
      actual_start_date: domain.actualStartDate,
      actual_end_date: domain.actualEndDate,
      status: domain.status,
      sequence: domain.sequence,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
    if (domain.id) {
      input.id = domain.id;
    }
    return input;
  }

  static toUpdateInput(domain: ProjectPhase): Prisma.ProjectPhaseUpdateInput {
    return {
      project: { connect: { id: domain.projectId } },
      name: domain.name,
      description: domain.description,
      progress: domain.progress,
      planned_start_date: domain.plannedStartDate,
      planned_end_date: domain.plannedEndDate,
      actual_start_date: domain.actualStartDate,
      actual_end_date: domain.actualEndDate,
      status: domain.status,
      sequence: domain.sequence,
      updated_at: domain.updatedAt,
    };
  }

  static toDto(domain: ProjectPhase): ProjectPhaseDto {
    return {
      id: domain.id,
      projectId: domain.projectId,
      name: domain.name,
      description: domain.description,
      progress: domain.progress,
      plannedStartDate: domain.plannedStartDate,
      plannedEndDate: domain.plannedEndDate,
      actualStartDate: domain.actualStartDate,
      actualEndDate: domain.actualEndDate,
      status: domain.status,
      sequence: domain.sequence,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
