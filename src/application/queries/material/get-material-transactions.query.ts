import { Query } from '@nestjs/cqrs';
import { MaterialTransactionDto } from '../../dto/material/transaction.dto';

export class GetMaterialTransactionsQuery extends Query<MaterialTransactionDto[]> {
  constructor(public readonly materialId: string) {
    super();
  }
}
