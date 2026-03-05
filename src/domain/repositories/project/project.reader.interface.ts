import { Project } from '../../entities/project.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const PROJECT_READER = Symbol('PROJECT_READER');

export interface IProjectReader {
  findById(id: string, tx?: ITransactionContext): Promise<Project | null>;
  existsById(id: string, tx?: ITransactionContext): Promise<boolean>;
}
