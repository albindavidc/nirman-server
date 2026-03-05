import { Project } from '../../entities/project.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const PROJECT_QUERY_READER = Symbol('PROJECT_QUERY_READER');

export interface IProjectQueryReader {
  findAll(tx?: ITransactionContext): Promise<Project[]>;
  findAllWithFilters(
    params: {
      search?: string;
      status?: string;
      page: number;
      limit: number;
    },
    tx?: ITransactionContext,
  ): Promise<{ projects: Project[]; total: number }>;
  findByCreator(userId: string, tx?: ITransactionContext): Promise<Project[]>;
  count(tx?: ITransactionContext): Promise<number>;
  countByStatus(status: string, tx?: ITransactionContext): Promise<number>;
  getAggregatedBudget(tx?: ITransactionContext): Promise<{
    totalBudget: number;
    totalSpent: number;
  }>;
}
