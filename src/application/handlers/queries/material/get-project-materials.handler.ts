import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MaterialRepository } from '../../../../infrastructure/persistence/repositories/material/material.repository';
import { MaterialTransactionRepository } from '../../../../infrastructure/persistence/repositories/material/material-transaction.repository';
import { MaterialDto } from '../../../dto/material/material.dto';
import { MaterialMapper } from '../../../mappers/material.mapper';

import { GetProjectMaterialsQuery } from '../../../queries/material/get-project-materials.query';

@QueryHandler(GetProjectMaterialsQuery)
export class GetProjectMaterialsHandler implements IQueryHandler<GetProjectMaterialsQuery> {
  constructor(
    private readonly repository: MaterialRepository,
    private readonly transactionRepository: MaterialTransactionRepository,
  ) {}

  async execute(query: GetProjectMaterialsQuery): Promise<MaterialDto[]> {
    const materials = await this.repository.findByProjectId(query.projectId);

    // Get transaction aggregates for each material
    const materialsWithTotals = await Promise.all(
      materials.map(async (material) => {
        const transactions = await this.transactionRepository.findByMaterialId(
          material.id,
        );

        const totalReceived = transactions
          .filter((t) => t.type === 'IN')
          .reduce((sum, t) => sum + t.quantity, 0);

        const totalUsed = transactions
          .filter((t) => t.type === 'OUT')
          .reduce((sum, t) => sum + t.quantity, 0);

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
