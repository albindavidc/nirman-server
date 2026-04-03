// Nominal typing brand to prevent accidental substitution of plain objects
import { Prisma } from '../../generated/client';

export interface ITransactionContext {
  tx: Prisma.TransactionClient;
}
