import { Query } from '@nestjs/cqrs';
import { ProjectStatsDto } from '../../dto/project/project-stats.dto';

export class GetProjectStatsQuery extends Query<ProjectStatsDto> {
  constructor() {
    super();
  }
}
