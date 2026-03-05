import { MaterialTransaction } from '../../entities/material-transaction.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_TRANSACTION_READER = Symbol(
  'MATERIAL_TRANSACTION_READER',
);

/**
 * ISP — Reader interface: minimal point-reads needed by guards and validators.
 */
export interface IMaterialTransactionReader {
  findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction | null>;
  existsById(id: string, tx?: ITransactionContext): Promise<boolean>;
}
