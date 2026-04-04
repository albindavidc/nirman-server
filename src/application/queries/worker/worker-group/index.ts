import { GetProjectGroupHandler } from '../../../handlers/queries/worker/worker-group/get-project-groups.handler';
import { GetWorkerGroupByIdHandler } from '../../../handlers/queries/worker/worker-group/get-worker-group-by-id.handler';

export * from './get-project-groups.query';
export * from './get-worker-group-by-id.query';

export const WorkerGroupQueryHandler = [
  GetProjectGroupHandler,
  GetWorkerGroupByIdHandler,
];
