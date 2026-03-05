import { ITransactionContext } from '../../interfaces/transaction-context.interface';
import { ProjectWorkerWithUser } from './project-worker-repository.interface';

export const PROJECT_WORKER_QUERY_READER = Symbol(
  'PROJECT_WORKER_QUERY_READER',
);

export interface IProjectWorkerQueryReader {
  /**
   * Get all workers of a project with user details
   */
  findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<ProjectWorkerWithUser[]>;

  /**
   * Check if a user is a worker of a project
   */
  isWorker(
    projectId: string,
    userId: string,
    tx?: ITransactionContext,
  ): Promise<boolean>;

  /**
   * Get existing worker IDs for a project
   */
  getWorkerIds(projectId: string, tx?: ITransactionContext): Promise<string[]>;
}
