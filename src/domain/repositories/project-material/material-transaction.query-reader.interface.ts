import { MaterialTransaction } from '../../entities/material-transaction.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_TRANSACTION_QUERY_READER = Symbol(
  'MATERIAL_TRANSACTION_QUERY_READER',
);

/**
 * ISP — Query-reader interface: complex reads for query handlers only.
 * No write operations — ever.
 */
export interface IMaterialTransactionQueryReader {
  findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction[]>;

  findByMaterialId(
    materialId: string,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction[]>;
}
