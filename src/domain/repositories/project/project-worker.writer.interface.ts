import { ITransactionContext } from '../../interfaces/transaction-context.interface';
import {
  ProjectWorkerData,
  AddWorkerData,
} from './project-worker-repository.interface';

export const PROJECT_WORKER_WRITER = Symbol('PROJECT_WORKER_WRITER');

export interface IProjectWorkerWriter {
  /**
   * Add multiple workers to a project
   * Returns the IDs of workers that were actually added (excluding duplicates)
   */
  addWorkers(
    projectId: string,
    workers: AddWorkerData[],
    tx?: ITransactionContext,
  ): Promise<{ addedCount: number; workers: ProjectWorkerData[] }>;

  /**
   * Remove a worker from a project
   */
  removeWorker(
    projectId: string,
    userId: string,
    tx?: ITransactionContext,
  ): Promise<ProjectWorkerData[]>;

  /**
   * Update a worker's role in a project
   */
  updateWorkerRole(
    projectId: string,
    userId: string,
    role: string,
    tx?: ITransactionContext,
  ): Promise<void>;
}
