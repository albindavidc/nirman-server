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
  TASK_REPOSITORY,
  ITaskRepository,
  Task,
  TaskDependency,
} from '../../../../domain/repositories/task-repository.interface';

@QueryHandler(GetPhaseTasksQuery)
export class GetPhaseTasksHandler implements IQueryHandler<GetPhaseTasksQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(query: GetPhaseTasksQuery): Promise<Task[]> {
    return this.taskRepository.findByPhaseId(query.phaseId);
  }
}

@QueryHandler(GetTaskDetailsQuery)
export class GetTaskDetailsHandler implements IQueryHandler<GetTaskDetailsQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(query: GetTaskDetailsQuery): Promise<Task | null> {
    return this.taskRepository.findById(query.taskId);
  }
}

@QueryHandler(GetTaskDependenciesQuery)
export class GetTaskDependenciesHandler implements IQueryHandler<GetTaskDependenciesQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(query: GetTaskDependenciesQuery): Promise<TaskDependency[]> {
    return this.taskRepository.findDependenciesByPhaseId(query.phaseId);
  }
}

@QueryHandler(GetProjectTasksQuery)
export class GetProjectTasksHandler implements IQueryHandler<GetProjectTasksQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(query: GetProjectTasksQuery): Promise<Task[]> {
    return this.taskRepository.findByProjectId(query.projectId);
  }
}

@QueryHandler(GetProjectDependenciesQuery)
export class GetProjectDependenciesHandler implements IQueryHandler<GetProjectDependenciesQuery> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(query: GetProjectDependenciesQuery): Promise<TaskDependency[]> {
    return this.taskRepository.findDependenciesByProjectId(query.projectId);
  }
}
