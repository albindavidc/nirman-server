import { IMaterialTransactionReader } from './material-transaction.reader.interface';
import { IMaterialTransactionWriter } from './material-transaction.writer.interface';
import { IMaterialTransactionQueryReader } from './material-transaction.query-reader.interface';

export const MATERIAL_TRANSACTION_REPOSITORY = Symbol(
  'MATERIAL_TRANSACTION_REPOSITORY',
);

/**
 * ISP — Composite repository that composes all three segregated interfaces.
 * Handlers inject the narrow interface they need — not this composite.
 */
export interface IMaterialTransactionRepository
  extends
    IMaterialTransactionReader,
    IMaterialTransactionWriter,
    IMaterialTransactionQueryReader {}
