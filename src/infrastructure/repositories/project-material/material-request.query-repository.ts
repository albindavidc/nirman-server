import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MaterialRequest } from '../../../domain/entities/material-request.entity';
import { MaterialRequestMapper } from '../../../application/mappers/material-request.mapper';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import {
  IMaterialRequestQueryReader,
  MaterialRequestFilter,
  PaginatedMaterialRequests,
} from '../../../domain/repositories/project-material/material-request.query-reader.interface';
import { RepositoryUtils } from '../repository.utils';
import { Prisma, PrismaClient } from '../../../generated/client/client';

/**
 * SRP — Handles ONLY complex read operations: paginated lists, date-range
 * queries, and projections. Zero write logic here, ever.
 *
 * ISP — Implements only IMaterialRequestQueryReader, never the full
 * IMaterialRequestRepository, so callers cannot accidentally call save().
 */
@Injectable()
export class MaterialRequestQueryRepository implements IMaterialRequestQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const records = await client.materialRequest.findMany({
        where: { project_id: projectId },
        orderBy: { created_at: 'desc' },
      });
      return records.map((r: Prisma.MaterialRequestGetPayload<{}>) =>
        MaterialRequestMapper.toDomain(r),
      );
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findPaginated(
    filters: MaterialRequestFilter,
    tx?: ITransactionContext,
  ): Promise<PaginatedMaterialRequests> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;

    // Fully typed Prisma where clause — no Record<string, unknown> bypass.
    const where: Prisma.MaterialRequestWhereInput = {};

    if (filters.projectId) where.project_id = filters.projectId;
    if (filters.requestedBy) where.requested_by = filters.requestedBy;
    if (filters.status) where.status = filters.status;
    if (filters.startDate && filters.endDate) {
      where.created_at = { gte: filters.startDate, lte: filters.endDate };
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    try {
      const [records, total] = await Promise.all([
        client.materialRequest.findMany({
          where,
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        client.materialRequest.count({ where }),
      ]);

      return {
        data: records.map((r: Prisma.MaterialRequestGetPayload<{}>) =>
          MaterialRequestMapper.toDomain(r),
        ),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByDateRange(
    projectId: string,
    startDate: Date,
    endDate: Date,
    tx?: ITransactionContext,
  ): Promise<MaterialRequest[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const records = await client.materialRequest.findMany({
        where: {
          project_id: projectId,
          created_at: { gte: startDate, lte: endDate },
        },
        orderBy: { created_at: 'desc' },
      });
      return records.map((r: Prisma.MaterialRequestGetPayload<{}>) =>
        MaterialRequestMapper.toDomain(r),
      );
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
