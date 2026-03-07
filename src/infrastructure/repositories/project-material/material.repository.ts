import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Material } from '../../../domain/entities/material.entity';
import { MaterialStatus } from '../../../domain/enums/material-status.enum';
import { MaterialMapper } from '../../../application/mappers/material.mapper';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { IMaterialReader } from '../../../domain/repositories/project-material/material.reader.interface';
import { IMaterialWriter } from '../../../domain/repositories/project-material/material.writer.interface';
import { RepositoryUtils } from '../repository.utils';

/**
 * SRP — Handles ONLY point-reads (findById, existsById) and write ops
 *       (save via upsert, softDelete). All list reads live in
 *       MaterialQueryRepository.
 *
 * ISP — Implements only IMaterialReader + IMaterialWriter.
 *
 * OCP — Core behaviour is stable; caching / logging are added via Decorator
 *       pattern — never by modifying this class.
 */
@Injectable()
export class MaterialRepository implements IMaterialReader, IMaterialWriter {
  constructor(private readonly prisma: PrismaService) {}

  // ── IMaterialReader ────────────────────────────────────────────────────────

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<Material | null> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const record = await client.material.findUnique({ where: { id } });
      return record ? MaterialMapper.toDomain(record) : null;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async existsById(id: string, tx?: ITransactionContext): Promise<boolean> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const count = await client.material.count({ where: { id } });
      return count > 0;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  // ── IMaterialWriter ────────────────────────────────────────────────────────

  /**
   * Architecture — Uses upsert so that both create and update go through a
   * single method. The schema's @updatedAt directive manages updated_at — we
   * never set it manually.
   */
  async save(entity: Material, tx?: ITransactionContext): Promise<Material> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    const createData = MaterialMapper.toUncheckedCreateInput(entity);
    const updateData = MaterialMapper.toUncheckedUpdateInput(entity);
    const isNew = !entity.id;
    try {
      const result = isNew
        ? await client.material.create({ data: createData })
        : await client.material.upsert({
            where: { id: entity.id },
            create: createData,
            update: updateData,
          });

      return MaterialMapper.toDomain(result);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  /**
   * Architecture — Soft-delete by transitioning status to the typed
   * MaterialStatus.ARCHIVED enum value — never raw string 'archived'.
   * Schema @updatedAt manages the timestamp automatically.
   */
  async softDelete(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      await client.material.update({
        where: { id },
        data: { status: MaterialStatus.ARCHIVED },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
