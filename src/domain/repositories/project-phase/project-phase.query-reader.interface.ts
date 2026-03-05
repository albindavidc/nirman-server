import { ProjectPhase } from '../../entities/project-phase.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';
import { PhaseWithApprovals } from './project-phase-repository.interface';

export const PROJECT_PHASE_QUERY_REPOSITORY = Symbol(
  'PROJECT_PHASE_QUERY_REPOSITORY',
);

export interface IProjectPhaseQueryReader {
  findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<ProjectPhase[]>;

  findWithApprovals(
    phaseId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseWithApprovals | null>;
}
