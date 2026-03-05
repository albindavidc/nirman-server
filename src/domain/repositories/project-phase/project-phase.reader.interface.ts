import { ProjectPhase } from '../../entities/project-phase.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export interface IProjectPhaseReader {
  findById(id: string, tx?: ITransactionContext): Promise<ProjectPhase | null>;
  existsById(id: string, tx?: ITransactionContext): Promise<boolean>;
}
