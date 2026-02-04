import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MaterialTransactionRepository } from '../../../../infrastructure/repositories/material-transaction.repository';
import { MaterialTransactionDto } from '../../../dto/material/transaction.dto';
import { MaterialTransactionMapper } from '../../../mappers/material-transaction.mapper';

import { GetMaterialTransactionsQuery } from '../../../queries/material/get-material-transactions.query';

@QueryHandler(GetMaterialTransactionsQuery)
export class GetMaterialTransactionsHandler implements IQueryHandler<GetMaterialTransactionsQuery> {
  constructor(private readonly repository: MaterialTransactionRepository) {}

  execute = async (
    query: GetMaterialTransactionsQuery,
  ): Promise<MaterialTransactionDto[]> => {
    const transactions = await this.repository.findByMaterialId(
      query.materialId,
    );
    return transactions.map((transaction) =>
      MaterialTransactionMapper.toDto(transaction),
    );
  };
}
