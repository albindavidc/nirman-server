import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  GetPhaseTasksQuery,
  GetTaskDetailsQuery,
  GetTaskDependenciesQuery,
  GetProjectTasksQuery,
  GetProjectDependenciesQuery,
} from '../../../queries/project/task.queries';
import {
  TASK_QUERY_REPOSITORY,
  ITaskQueryReader,
} from '../../../../domain/repositories/project-phase/task.query-repository.interface';
import { TASK_REPOSITORY } from '../../../../domain/repositories/project-phase/task.repository.interface';
import { ITaskReader } from '../../../../domain/repositories/project-phase/task.reader.interface';
import {
  TaskEntity,
  TaskDependencyEntity,
} from '../../../../domain/entities/task.entity';

@QueryHandler(GetPhaseTasksQuery)
export class GetPhaseTasksHandler implements IQueryHandler<GetPhaseTasksQuery> {
  constructor(
    @Inject(TASK_QUERY_REPOSITORY)
    private readonly taskQueryReader: ITaskQueryReader,
  ) {}

  async execute(query: GetPhaseTasksQuery): Promise<TaskEntity[]> {
    return this.taskQueryReader.findByPhaseId(query.phaseId);
  }
}

@QueryHandler(GetTaskDetailsQuery)
export class GetTaskDetailsHandler implements IQueryHandler<GetTaskDetailsQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskReader: ITaskReader,
  ) {}

  async execute(query: GetTaskDetailsQuery): Promise<TaskEntity | null> {
    return this.taskReader.findById(query.taskId);
  }
}

@QueryHandler(GetTaskDependenciesQuery)
export class GetTaskDependenciesHandler implements IQueryHandler<GetTaskDependenciesQuery> {
  constructor(
    @Inject(TASK_QUERY_REPOSITORY)
    private readonly taskQueryReader: ITaskQueryReader,
  ) {}

  async execute(
    query: GetTaskDependenciesQuery,
  ): Promise<TaskDependencyEntity[]> {
    return this.taskQueryReader.findDependenciesByPhaseId(query.phaseId);
  }
}

@QueryHandler(GetProjectTasksQuery)
export class GetProjectTasksHandler implements IQueryHandler<GetProjectTasksQuery> {
  constructor(
    @Inject(TASK_QUERY_REPOSITORY)
    private readonly taskQueryReader: ITaskQueryReader,
  ) {}

  async execute(query: GetProjectTasksQuery): Promise<TaskEntity[]> {
    return this.taskQueryReader.findByProjectId(query.projectId);
  }
}

@QueryHandler(GetProjectDependenciesQuery)
export class GetProjectDependenciesHandler implements IQueryHandler<GetProjectDependenciesQuery> {
  constructor(
    @Inject(TASK_QUERY_REPOSITORY)
    private readonly taskQueryReader: ITaskQueryReader,
  ) {}

  async execute(
    query: GetProjectDependenciesQuery,
  ): Promise<TaskDependencyEntity[]> {
    return this.taskQueryReader.findDependenciesByProjectId(query.projectId);
  }
}
