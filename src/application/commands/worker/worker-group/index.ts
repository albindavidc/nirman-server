import { AddMemberHandler } from '../../../handlers/commands/worker/worker-group/add-member.handler';
import { CreateWorkerGroupHandler } from '../../../handlers/commands/worker/worker-group/create-worker-group.handler';
import { DeleteWorkerGroupHandler } from '../../../handlers/commands/worker/worker-group/delete-worker-group.handler';
import { RemoveMemberHandler } from '../../../handlers/commands/worker/worker-group/remove-member.handler';
import { UpdateWorkerGroupHandler } from '../../../handlers/commands/worker/worker-group/update-worker-group.handler';

export * from './create-worker-group.command';
export * from './update-worker-group.command';
export * from './delete-worker-group.command';
export * from './add-member.command';
export * from './remove-member.command';

export const WorkerGroupCommandHandler = [
  CreateWorkerGroupHandler,
  UpdateWorkerGroupHandler,
  DeleteWorkerGroupHandler,
  AddMemberHandler,
  RemoveMemberHandler,
];
