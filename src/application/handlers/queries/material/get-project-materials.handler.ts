import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IMaterialQueryReader,
  MATERIAL_QUERY_READER,
} from '../../../../domain/repositories/project-material/material.query-reader.interface';
import {
  IMaterialTransactionQueryReader,
  MATERIAL_TRANSACTION_QUERY_READER,
} from '../../../../domain/repositories/project-material/material-transaction.query-reader.interface';
import { MaterialTransaction } from '../../../../domain/entities/material-transaction.entity';
import { MaterialDto } from '../../../dto/material/material.dto';
import { MaterialMapper } from '../../../mappers/material.mapper';
import { GetProjectMaterialsQuery } from '../../../queries/material/get-project-materials.query';

/**
 * DIP — injects only the query-reader interfaces via Symbol tokens.
 * No direct reference to any infrastructure class.
 */
@QueryHandler(GetProjectMaterialsQuery)
export class GetProjectMaterialsHandler implements IQueryHandler<GetProjectMaterialsQuery> {
  constructor(
    @Inject(MATERIAL_QUERY_READER)
    private readonly materialQueryReader: IMaterialQueryReader,
    @Inject(MATERIAL_TRANSACTION_QUERY_READER)
    private readonly transactionQueryReader: IMaterialTransactionQueryReader,
  ) {}

  async execute(query: GetProjectMaterialsQuery): Promise<MaterialDto[]> {
    const materials = await this.materialQueryReader.findByProjectId(
      query.projectId,
    );

    const materialsWithTotals = await Promise.all(
      materials.map(async (material) => {
        const transactions: MaterialTransaction[] =
          await this.transactionQueryReader.findByMaterialId(material.id);

        const totalReceived = transactions
          .filter((t: MaterialTransaction) => t.type === 'IN')
          .reduce((sum: number, t: MaterialTransaction) => sum + t.quantity, 0);

        const totalUsed = transactions
          .filter((t: MaterialTransaction) => t.type === 'OUT')
          .reduce((sum: number, t: MaterialTransaction) => sum + t.quantity, 0);

        return {
          ...MaterialMapper.toDto(material),
          totalReceived,
          totalUsed,
        };
      }),
    );

    return materialsWithTotals;
  }
}
