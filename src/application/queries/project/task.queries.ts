import { Query } from '@nestjs/cqrs';
import { TaskEntity, TaskDependencyEntity } from '../../../domain/entities/task.entity';

export class GetPhaseTasksQuery extends Query<TaskEntity[]> {
  constructor(public readonly phaseId: string) {
    super();
  }
}

export class GetTaskDetailsQuery extends Query<TaskEntity | null> {
  constructor(public readonly taskId: string) {
    super();
  }
}

export class GetTaskDependenciesQuery extends Query<TaskDependencyEntity[]> {
  constructor(public readonly phaseId: string) {
    super();
  }
}

export class GetProjectTasksQuery extends Query<TaskEntity[]> {
  constructor(public readonly projectId: string) {
    super();
  }
}

export class GetProjectDependenciesQuery extends Query<TaskDependencyEntity[]> {
  constructor(public readonly projectId: string) {
    super();
  }
}
