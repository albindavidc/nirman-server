import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MaterialTransaction } from '../../../domain/entities/material-transaction.entity';
import { MaterialTransactionMapper } from '../../../application/mappers/material-transaction.mapper';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { IMaterialTransactionReader } from '../../../domain/repositories/project-material/material-transaction.reader.interface';
import { IMaterialTransactionWriter } from '../../../domain/repositories/project-material/material-transaction.writer.interface';
import { RepositoryUtils } from '../repository.utils';
import { PrismaClient } from '../../../generated/client/client';

/**
 * SRP — Handles ONLY point-reads (findById, existsById) and writes (save).
 *       All complex query operations live in MaterialTransactionQueryRepository.
 *
 * ISP — Implements only IMaterialTransactionReader + IMaterialTransactionWriter.
 *
 * OCP — Core behaviour is stable; caching / logging added via Decorator — never
 *       by modifying this class.
 */
@Injectable()
export class MaterialTransactionRepository
  implements IMaterialTransactionReader, IMaterialTransactionWriter
{
  constructor(private readonly prisma: PrismaService) {}

  // ── IMaterialTransactionReader ─────────────────────────────────────────────

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const record = await client.materialTransaction.findUnique({
        where: { id },
      });
      return record ? MaterialTransactionMapper.toDomain(record) : null;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async existsById(id: string, tx?: ITransactionContext): Promise<boolean> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const count = await client.materialTransaction.count({ where: { id } });
      return count > 0;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  // ── IMaterialTransactionWriter ─────────────────────────────────────────────

  /**
   * Architecture — Transactions are immutable records; we use create().
   * upsert() would be incorrect here because updating a financial transaction
   * violates audit-trail integrity. save() always creates a new record.
   */
  async save(
    entity: MaterialTransaction,
    tx?: ITransactionContext,
  ): Promise<MaterialTransaction> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const result = await client.materialTransaction.create({
        data: MaterialTransactionMapper.toPersistence(entity),
      });
      return MaterialTransactionMapper.toDomain(result);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
