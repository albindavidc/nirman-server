import { Material } from '../../entities/material.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_QUERY_READER = Symbol('MATERIAL_QUERY_READER');

/**
 * ISP — Query-reader interface: complex reads for query handlers only.
 * No write operations — ever.
 */
export interface IMaterialQueryReader {
  findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<Material[]>;
}
