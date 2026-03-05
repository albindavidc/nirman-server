import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Material } from '../../../domain/entities/material.entity';
import { MaterialMapper } from '../../../application/mappers/material.mapper';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { IMaterialQueryReader } from '../../../domain/repositories/project-material/material.query-reader.interface';
import { RepositoryUtils } from '../repository.utils';

/**
 * SRP — Handles ONLY complex read operations (project-level material lists).
 *       Zero write logic here, ever.
 *
 * ISP — Implements only IMaterialQueryReader.
 */
@Injectable()
export class MaterialQueryRepository implements IMaterialQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  // ── IMaterialQueryReader ───────────────────────────────────────────────────

  async findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<Material[]> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const records = await client.material.findMany({
        where: { project_id: projectId },
        orderBy: { created_at: 'desc' },
      });
      return records.map((r) => MaterialMapper.toDomain(r));
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
