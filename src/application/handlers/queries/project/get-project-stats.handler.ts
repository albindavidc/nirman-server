import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectStatsQuery } from '../../../queries/project/get-project-stats.query';
import {
  IProjectQueryReader,
  PROJECT_QUERY_READER,
} from '../../../../domain/repositories/project/project.query-reader.interface';
import { ProjectStatsDto } from '../../../dto/project/project-stats.dto';

@QueryHandler(GetProjectStatsQuery)
export class GetProjectStatsHandler implements IQueryHandler<GetProjectStatsQuery> {
  constructor(
    @Inject(PROJECT_QUERY_READER)
    private readonly projectQueryReader: IProjectQueryReader,
  ) {}

  async execute(): Promise<ProjectStatsDto> {
    const [total, active, completed, paused] = await Promise.all([
      this.projectQueryReader.count(),
      this.projectQueryReader.countByStatus('active'),
      this.projectQueryReader.countByStatus('completed'),
      this.projectQueryReader.countByStatus('paused'),
    ]);

    const { totalBudget, totalSpent } =
      await this.projectQueryReader.getAggregatedBudget();

    return {
      total,
      active,
      completed,
      paused,
      totalBudget,
      totalSpent,
    };
  }
}
