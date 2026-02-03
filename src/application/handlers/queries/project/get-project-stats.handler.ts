import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectStatsQuery } from '../../../queries/project/get-project-stats.query';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project-repository.interface';
import { ProjectStatsDto } from '../../../dto/project/project-stats.dto';

@QueryHandler(GetProjectStatsQuery)
export class GetProjectStatsHandler implements IQueryHandler<GetProjectStatsQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(): Promise<ProjectStatsDto> {
    const [total, active, completed, paused] = await Promise.all([
      this.projectRepository.count(),
      this.projectRepository.countByStatus('active'),
      this.projectRepository.countByStatus('completed'),
      this.projectRepository.countByStatus('paused'),
    ]);

    const { totalBudget, totalSpent } =
      await this.projectRepository.getAggregatedBudget();

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
