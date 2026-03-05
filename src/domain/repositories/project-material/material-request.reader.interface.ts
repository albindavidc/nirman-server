import { MaterialRequest } from '../../entities/material-request.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_REQUEST_READER = Symbol('MATERIAL_REQUEST_READER');

/**
 * ISP — Reader interface: only minimal read operations needed by validators
 * and guards that must check existence or retrieve a single entity.
 */
export interface IMaterialRequestReader {
  findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest | null>;
  existsById(id: string, tx?: ITransactionContext): Promise<boolean>;
}
