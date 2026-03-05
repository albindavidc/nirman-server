import { MaterialTransaction } from '../../entities/material-transaction.entity';
import { ITransactionContext } from '../../interfaces/transaction-context.interface';

export const MATERIAL_TRANSACTION_WRITER = Symbol(
  'MATERIAL_TRANSACTION_WRITER',
);

/**
 * ISP — Writer interface: only mutation operations needed by command handlers.
 * Transactions are record-immutable by business rule — no softDelete needed.
 */
export interface IMaterialTransactionWriter {
  save(
    entity: MaterialTransaction,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction>;
}
