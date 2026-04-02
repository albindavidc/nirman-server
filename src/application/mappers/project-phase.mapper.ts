import { ProjectPhase } from '../../domain/entities/project-phase.entity';
import {
  Prisma,
  ProjectPhase as PrismaProjectPhase,
  Status,
} from '../../generated/client/client';
import { ProjectPhaseDto } from '../dto/project/phase/project-phase.dto';

export class ProjectPhaseMapper {
  static toDomain(persistence: PrismaProjectPhase): ProjectPhase {
    return new ProjectPhase(
      persistence.id,
      persistence.projectId,
      persistence.name,
      persistence.description,
      persistence.progress,
      persistence.plannedStartDate,
      persistence.plannedEndDate,
      persistence.actualStartDate,
      persistence.actualEndDate,
      persistence.status,
      persistence.sequence,
      persistence.createdAt,
      persistence.updatedAt,
    );
  }

  static toCreateInput(domain: ProjectPhase): Prisma.ProjectPhaseCreateInput {
    // Prisma will generate an id if none is supplied; avoid passing an empty string
    const input: any = {
      project: { connect: { id: domain.projectId } },
      name: domain.name,
      description: domain.description,
      progress: domain.progress,
      plannedStartDate: domain.plannedStartDate,
      plannedEndDate: domain.plannedEndDate,
      actualStartDate: domain.actualStartDate,
      actualEndDate: domain.actualEndDate,
      status: this.mapStatus(domain.status),
      sequence: domain.sequence,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
    if (domain.id) {
      input.id = domain.id;
    }
    return input;
  }

  static toUpdateInput(domain: ProjectPhase): Prisma.ProjectPhaseUpdateInput {
    return {
      name: domain.name,
      description: domain.description,
      progress: domain.progress,
      plannedStartDate: domain.plannedStartDate,
      plannedEndDate: domain.plannedEndDate,
      actualStartDate: domain.actualStartDate,
      actualEndDate: domain.actualEndDate,
      status: this.mapStatus(domain.status),
      sequence: domain.sequence,
      updatedAt: domain.updatedAt,
    };
  }

  private static mapStatus(status: any): Status {
    if (!status) return Status.not_started;
    const s = String(status).toLowerCase().replace(/\s+/g, '_');

    switch (s) {
      case 'todo':
      case 'not_started':
        return Status.not_started;
      case 'in_progress':
        return Status.in_progress;
      case 'done':
      case 'completed':
        return Status.completed;
      case 'delayed':
        return Status.delayed;
      case 'on_hold':
        return Status.on_hold;
      default:
        return Status.not_started;
    }
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
