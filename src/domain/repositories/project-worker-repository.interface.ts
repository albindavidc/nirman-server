/**
 * Project Worker Repository Interface
 */

import { ProjectWorker } from '../types';

export type ProjectWorkerData = ProjectWorker;

export interface ProjectWorkerWithUser extends ProjectWorker {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string | null;
    profilePhoto: string | null;
    title: string;
  } | null;
}

export interface AddWorkerData {
  userId: string;
  role: string;
}

export interface IProjectWorkerRepository {
  /**
   * Get all workers of a project with user details
   */
  findByProjectId(projectId: string): Promise<ProjectWorkerWithUser[]>;

  /**
   * Add multiple workers to a project
   * Returns the IDs of workers that were actually added (excluding duplicates)
   */
  addWorkers(
    projectId: string,
    workers: AddWorkerData[],
  ): Promise<{ addedCount: number; workers: ProjectWorkerData[] }>;

  /**
   * Remove a worker from a project
   */
  removeWorker(projectId: string, userId: string): Promise<ProjectWorkerData[]>;

  /**
   * Update a worker's role in a project
   */
  updateWorkerRole(
    projectId: string,
    userId: string,
    role: string,
  ): Promise<void>;

  /**
   * Check if a user is a worker of a project
   */
  isWorker(projectId: string, userId: string): Promise<boolean>;

  /**
   * Get existing worker IDs for a project
   */
  getWorkerIds(projectId: string): Promise<string[]>;
}

/**
 * Injection token for the Project Worker repository
 */
export const PROJECT_WORKER_REPOSITORY = Symbol('PROJECT_WORKER_REPOSITORY');
