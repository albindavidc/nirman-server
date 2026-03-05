import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MaterialTransactionDto } from '../../../dto/material/transaction.dto';
import { MaterialTransactionMapper } from '../../../mappers/material-transaction.mapper';
import { GetMaterialTransactionsQuery } from '../../../queries/material/get-material-transactions.query';
import {
  IMaterialTransactionQueryReader,
  MATERIAL_TRANSACTION_QUERY_READER,
} from '../../../../domain/repositories/project-material/material-transaction.query-reader.interface';

/**
 * DIP — injects only the query-reader interface via Symbol token.
 * Query handlers must never see write operations.
 * No direct reference to any infrastructure class.
 */
@QueryHandler(GetMaterialTransactionsQuery)
export class GetMaterialTransactionsHandler implements IQueryHandler<GetMaterialTransactionsQuery> {
  constructor(
    @Inject(MATERIAL_TRANSACTION_QUERY_READER)
    private readonly queryReader: IMaterialTransactionQueryReader,
  ) {}

  async execute(
    query: GetMaterialTransactionsQuery,
  ): Promise<MaterialTransactionDto[]> {
    const transactions = await this.queryReader.findByMaterialId(
      query.materialId,
    );
    return transactions.map((t) => MaterialTransactionMapper.toDto(t));
  }
}
