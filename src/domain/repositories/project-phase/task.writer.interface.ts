import { ITransactionContext } from '../../interfaces/transaction-context.interface';
import { TaskEntity, TaskDependencyEntity } from '../../entities/task.entity';

export interface ITaskWriter {
  save(entity: TaskEntity, tx?: ITransactionContext): Promise<TaskEntity>;
  softDelete(id: string, tx?: ITransactionContext): Promise<void>;

  addDependency(
    entity: TaskDependencyEntity,
    tx?: ITransactionContext,
  ): Promise<TaskDependencyEntity>;
  removeDependency(id: string, tx?: ITransactionContext): Promise<void>;
}
