import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MaterialTransaction } from '../../../domain/entities/material-transaction.entity';
import { MaterialTransactionMapper } from '../../../application/mappers/material-transaction.mapper';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { IMaterialTransactionQueryReader } from '../../../domain/repositories/project-material/material-transaction.query-reader.interface';
import { RepositoryUtils } from '../repository.utils';

/**
 * SRP — Handles ONLY complex read operations: material-level and
 *       project-level transaction lists. Zero write logic here, ever.
 *
 * ISP — Implements only IMaterialTransactionQueryReader, so callers
 *       cannot accidentally call save() through this class.
 */
@Injectable()
export class MaterialTransactionQueryRepository implements IMaterialTransactionQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  // ── IMaterialTransactionQueryReader ───────────────────────────────────────

  async findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction[]> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const records = await client.materialTransaction.findMany({
        where: { material: { project_id: projectId } },
        orderBy: { date: 'desc' },
      });
      return records.map((r) => MaterialTransactionMapper.toDomain(r));
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByMaterialId(
    materialId: string,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction[]> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const records = await client.materialTransaction.findMany({
        where: { material_id: materialId },
        orderBy: { date: 'desc' },
      });
      return records.map((r) => MaterialTransactionMapper.toDomain(r));
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
