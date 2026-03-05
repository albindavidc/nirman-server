import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MaterialRequest } from '../../../domain/entities/material-request.entity';
import { MaterialRequestMapper } from '../../../application/mappers/material-request.mapper';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { IMaterialRequestReader } from '../../../domain/repositories/project-material/material-request.reader.interface';
import { IMaterialRequestWriter } from '../../../domain/repositories/project-material/material-request.writer.interface';
import { RepositoryUtils } from '../repository.utils';
import { MaterialRequestStatus } from '../../../domain/enums/material-request-status.enum';

/**
 * SRP — Handles ONLY write mutations and simple point-reads.
 *       All complex query operations live in MaterialRequestQueryRepository.
 *
 * ISP — Implements IMaterialRequestReader + IMaterialRequestWriter only.
 *       Never the full IMaterialRequestRepository composite.
 *
 * OCP — Core behaviour is stable; caching / logging added via Decorator —
 *       never by modifying this class.
 */
@Injectable()
export class MaterialRequestRepository
  implements IMaterialRequestReader, IMaterialRequestWriter
{
  constructor(private readonly prisma: PrismaService) {}

  // ── IMaterialRequestReader ─────────────────────────────────────────────────

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest | null> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const record = await client.materialRequest.findUnique({ where: { id } });
      return record ? MaterialRequestMapper.toDomain(record) : null;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async existsById(id: string, tx?: ITransactionContext): Promise<boolean> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const count = await client.materialRequest.count({ where: { id } });
      return count > 0;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  // ── IMaterialRequestWriter ─────────────────────────────────────────────────

  /**
   * OCP / Architecture — save() uses upsert (not separate create + update).
   * No `updated_at: new Date()` — the schema @updatedAt directive handles it.
   */
  async save(
    entity: MaterialRequest,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    const createData = MaterialRequestMapper.toCreateInput(entity);
    const updateData = MaterialRequestMapper.toUpdateInput(entity);

    try {
      const result = await client.materialRequest.upsert({
        where: { id: entity.id || '__new__' },
        create: createData,
        update: updateData,
      });
      return MaterialRequestMapper.toDomain(result);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  /**
   * Soft-delete using the domain enum value — never a raw string literal.
   */
  async softDelete(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      await client.materialRequest.update({
        where: { id },
        data: { status: MaterialRequestStatus.CANCELLED },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
