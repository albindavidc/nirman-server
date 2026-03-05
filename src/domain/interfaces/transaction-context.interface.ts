// Nominal typing brand to prevent accidental substitution of plain objects
export interface ITransactionContext {
  readonly _brand: 'TransactionContext';
}
