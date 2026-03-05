import { Project } from '../../entities/project.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const PROJECT_WRITER = Symbol('PROJECT_WRITER');

export interface IProjectWriter {
  save(entity: Project, tx?: ITransactionContext): Promise<Project>;
  softDelete(id: string, tx?: ITransactionContext): Promise<void>;
}
