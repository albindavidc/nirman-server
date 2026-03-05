import { ITransactionContext } from '../../domain/interfaces/transaction-context.interface';
import { Prisma } from '../../generated/client/client';

export class PrismaTransactionContext implements ITransactionContext {
  readonly _brand = 'TransactionContext' as const;
  constructor(public readonly client: Prisma.TransactionClient) {}
}
