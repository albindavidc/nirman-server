import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { WORKER_GROUP_QUERY_REPOSITORY } from '../../../../../domain/repositories/worker';
import { IWorkerGroupQueryReader } from '../../../../../domain/repositories/worker';
import { WorkerGroupResponseDto } from '../../../../dto/worker/worker-group/worker-group-response.dto';
import { WorkerGroupMapper } from '../../../../mappers/worker/worker-group/worker-group.mapper';
import { GetWorkerGroupByIdQuery } from '../../../../queries/worker/worker-group/get-worker-group-by-id.query';

@QueryHandler(GetWorkerGroupByIdQuery)
export class GetWorkerGroupByIdHandler implements IQueryHandler<GetWorkerGroupByIdQuery> {
  constructor(
    @Inject(WORKER_GROUP_QUERY_REPOSITORY)
    private readonly repo: IWorkerGroupQueryReader,
  ) {}

  async execute(
    query: GetWorkerGroupByIdQuery,
  ): Promise<WorkerGroupResponseDto> {
    const props = await this.repo.findByIdWithMembers(query.id);

    if (!props) {
      throw new Error('Worker group not found');
    }

    if (query.withMembers) {
      return WorkerGroupMapper.toResponseWithMembers(props);
    }

    return WorkerGroupMapper.toResponse(props);
  }
}
