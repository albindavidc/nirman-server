import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMyTasksQuery } from '../../../queries/project/get-my-tasks.query';
import {
  ITaskRepository,
  TASK_REPOSITORY,
  Task,
} from '../../../../domain/repositories/task-repository.interface';

@QueryHandler(GetMyTasksQuery)
export class GetMyTasksHandler implements IQueryHandler<GetMyTasksQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(query: GetMyTasksQuery): Promise<Task[]> {
    return this.taskRepository.findByAssigneeId(query.userId);
  }
}
