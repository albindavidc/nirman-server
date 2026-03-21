import { Query } from '@nestjs/cqrs';
import { ProjectPhaseDto } from '../../dto/project/phase/project-phase.dto';

export class GetProjectPhasesQuery extends Query<ProjectPhaseDto[]> {
  constructor(public readonly projectId: string) {
    super();
  }
}
