import { ITransactionContext } from '../../interfaces/transaction-context.interface';
import { TaskEntity } from '../../entities/task.entity';

export interface ITaskReader {
  findById(id: string, tx?: ITransactionContext): Promise<TaskEntity | null>;
  existsById(id: string, tx?: ITransactionContext): Promise<boolean>;
}
