import { IQuery } from '@nestjs/cqrs';

export class GetPhaseTasksQuery implements IQuery {
  constructor(public readonly phaseId: string) {}
}

export class GetTaskDetailsQuery implements IQuery {
  constructor(public readonly taskId: string) {}
}

export class GetTaskDependenciesQuery implements IQuery {
  constructor(public readonly phaseId: string) {}
}

export class GetProjectTasksQuery implements IQuery {
  constructor(public readonly projectId: string) {}
}

export class GetProjectDependenciesQuery implements IQuery {
  constructor(public readonly projectId: string) {}
}
