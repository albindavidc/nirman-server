import { WorkerGroupEntity } from '../../entities/worker-group.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export interface IWorkerGroupReader {
  findById(
    id: string,
    context?: ITransactionContext,
  ): Promise<WorkerGroupEntity | null>;
  findByProjectId(
    projectId: string,
    context?: ITransactionContext,
  ): Promise<WorkerGroupEntity[]>;

  existsByName(
    name: string,
    projectId: string,
    excludeId?: string,
    context?: ITransactionContext,
  ): Promise<boolean>;
  isMemberInGroup(
    workerId: string,
    groupId: string,
    context?: ITransactionContext,
  ): Promise<boolean>;
}
