import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMyTasksQuery } from '../../../queries/project/get-my-tasks.query';
import {
  ITaskQueryReader,
  TASK_QUERY_REPOSITORY,
} from '../../../../domain/repositories/project-phase/task.query-repository.interface';
import { TaskEntity } from '../../../../domain/entities/task.entity';

@QueryHandler(GetMyTasksQuery)
export class GetMyTasksHandler implements IQueryHandler<GetMyTasksQuery> {
  constructor(
    @Inject(TASK_QUERY_REPOSITORY)
    private readonly taskQueryReader: ITaskQueryReader,
  ) {}

  async execute(query: GetMyTasksQuery): Promise<TaskEntity[]> {
    return this.taskQueryReader.findByAssigneeId(query.userId);
  }
}
