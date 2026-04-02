import {
  WorkerGroupEntity,
  WorkerGroupProps,
} from '../../entities/worker-group.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export type CreateWorkerGroupData = Pick<
  WorkerGroupProps,
  'name' | 'description' | 'trade' | 'projectId' | 'createdById' | 'isActive'
> & {
  members?: { workerId: string }[];
};

export type UpdateWorkerGroupData = Partial<
  Pick<WorkerGroupProps, 'name' | 'description' | 'trade' | 'isActive'>
>;

export interface IWorkerGroupWriter {
  create(
    data: CreateWorkerGroupData,
    ctx?: ITransactionContext,
  ): Promise<WorkerGroupEntity>;
  update(
    id: string,
    data: UpdateWorkerGroupData,
    ctx?: ITransactionContext,
  ): Promise<WorkerGroupEntity>;
  softDelete(id: string, ctx?: ITransactionContext): Promise<void>;
  addMember(
    groupId: string,
    workerId: string,
    ctx?: ITransactionContext,
  ): Promise<void>;
  removeMember(
    groupId: string,
    workerId: string,
    ctx?: ITransactionContext,
  ): Promise<void>;
}
