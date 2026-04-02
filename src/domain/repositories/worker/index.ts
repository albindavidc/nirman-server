import { IWorkerGroupReader } from './worker-group.reader.interface';
import { IWorkerGroupWriter } from './worker-group.writer.interface';

export interface IWorkerGroupRepository
  extends IWorkerGroupReader, IWorkerGroupWriter {}

export const WORKER_GROUP_REPOSITORY = Symbol('WORKER_GROUP_REPOSITORY');
export const WORKER_GROUP_QUERY_REPOSITORY = Symbol(
  'WORKER_GROUP_QUERY_REPOSITORY',
);

export type { IWorkerGroupReader } from './worker-group.reader.interface';
export type { IWorkerGroupWriter } from './worker-group.writer.interface';
export type {
  IWorkerGroupQueryReader,
  GetProjectGroupFilter,
} from './worker-group.query-reader.interface';
export type {
  CreateWorkerGroupData,
  UpdateWorkerGroupData,
} from './worker-group.writer.interface';
