import { ProjectPhase as PrismaProjectPhase } from '../../generated/client/client';
import { ProjectPhase } from '../../domain/entities/project-phase.entity';
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

  static toPersistence(
    domain: ProjectPhase,
  ): Omit<PrismaProjectPhase, 'id' | 'created_at' | 'updated_at'> {
    return {
      project_id: domain.projectId,
      name: domain.name,
      description: domain.description,
      progress: domain.progress,
      planned_start_date: domain.plannedStartDate,
      planned_end_date: domain.plannedEndDate,
      actual_start_date: domain.actualStartDate,
      actual_end_date: domain.actualEndDate,
      status: domain.status,
      sequence: domain.sequence,
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
