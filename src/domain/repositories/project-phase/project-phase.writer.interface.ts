import { ProjectPhase } from '../../entities/project-phase.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export interface IProjectPhaseWriter {
  save(phase: ProjectPhase, tx?: ITransactionContext): Promise<ProjectPhase>;
  softDelete(id: string, tx?: ITransactionContext): Promise<void>;
}
