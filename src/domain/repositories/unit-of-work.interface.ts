import { ITransactionContext } from '../interfaces/transaction-context.interface';

export const IUnitOfWorkToken = Symbol('IUnitOfWork');

export interface IUnitOfWork {
  run<T>(work: (tx: ITransactionContext) => Promise<T>): Promise<T>;
}
