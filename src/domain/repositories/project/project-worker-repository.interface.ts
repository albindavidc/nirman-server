/**
 * Project Worker Repository Interface
 */

import { ProjectWorker } from '../../types';
import { IProjectWorkerReader } from './project-worker.reader.interface';
import { IProjectWorkerWriter } from './project-worker.writer.interface';
import { IProjectWorkerQueryReader } from './project-worker.query-reader.interface';

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

export interface IProjectWorkerRepository
  extends
    IProjectWorkerReader,
    IProjectWorkerWriter,
    IProjectWorkerQueryReader {}

/**
 * Injection token for the Project Worker repository
 */
export const PROJECT_WORKER_REPOSITORY = Symbol('PROJECT_WORKER_REPOSITORY');
