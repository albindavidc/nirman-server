import { TaskEntity, TaskDependencyEntity } from '../../entities/task.entity';

export const TASK_QUERY_REPOSITORY = Symbol('TASK_QUERY_REPOSITORY');

export interface ITaskQueryReader {
  findByPhaseId(phaseId: string): Promise<TaskEntity[]>;
  findByProjectId(projectId: string): Promise<TaskEntity[]>;
  findByAssigneeId(userId: string): Promise<TaskEntity[]>;
  findDependenciesByPhaseId(phaseId: string): Promise<TaskDependencyEntity[]>;
  findDependenciesByProjectId(
    projectId: string,
  ): Promise<TaskDependencyEntity[]>;
}
