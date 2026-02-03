import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProjectPhaseDto } from '../../../dto/project/phase/project-phase.dto';
import { ProjectPhaseMapper } from '../../../mappers/project-phase.mapper';
import { GetProjectPhasesQuery } from '../../../queries/project/get-project-phases.query';
import {
  IProjectPhaseRepository,
  PROJECT_PHASE_REPOSITORY,
} from '../../../../domain/repositories/project-phase-repository.interface';

@QueryHandler(GetProjectPhasesQuery)
export class GetProjectPhasesHandler implements IQueryHandler<GetProjectPhasesQuery> {
  constructor(
    @Inject(PROJECT_PHASE_REPOSITORY)
    private readonly projectPhaseRepository: IProjectPhaseRepository,
  ) {}

  async execute(query: GetProjectPhasesQuery): Promise<ProjectPhaseDto[]> {
    const phases = await this.projectPhaseRepository.findByProjectId(
      query.projectId,
    );
    return phases.map((phase) => ProjectPhaseMapper.toDto(phase));
  }
}
