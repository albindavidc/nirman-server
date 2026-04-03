import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectGroupQuery } from '../../../../queries/worker/worker-group/get-project-groups.query';
import { Inject } from '@nestjs/common';
import {
  IWorkerGroupQueryReader,
  WORKER_GROUP_QUERY_REPOSITORY,
} from '../../../../../domain/repositories/worker';
import { WorkerGroupResponseDto } from '../../../../dto/worker/worker-group/worker-group-response.dto';
import { WorkerGroupMapper } from '../../../../mappers/worker/worker-group/worker-group.mapper';
import { WorkerGroupEntity } from '../../../../../domain/entities/worker-group.entity';

@QueryHandler(GetProjectGroupQuery)
export class GetProjectGroupHandler implements IQueryHandler<GetProjectGroupQuery> {
  constructor(
    @Inject(WORKER_GROUP_QUERY_REPOSITORY)
    private readonly repo: IWorkerGroupQueryReader,
  ) {}

  async execute(
    query: GetProjectGroupQuery,
  ): Promise<WorkerGroupResponseDto[]> {
    const groups = await this.repo.findAllByProject({
      projectId: query.projectId,
      trade: query.trade,
      isActive: query.isActive,
      search: query.search,
    });
    return groups.map((group) => {
        return WorkerGroupMapper.toResponse(group);
    });
  }
}
