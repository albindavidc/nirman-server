import { Injectable } from '@nestjs/common';
import { ITransactionContext } from 'src/domain/interfaces/transaction-context.interface';
import {
  CreateWorkerGroupData,
  IWorkerGroupRepository,
  UpdateWorkerGroupData,
} from 'src/domain/repositories/worker';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import { RepositoryUtils } from '../../repository.utils';
import {
  WorkerGroupEntity,
  WorkerGroupProps,
} from 'src/domain/entities/worker-group.entity';
import { WorkerGroupMapper } from 'src/application/mappers/worker/worker-group/worker-group.mapper';
import { TradeType } from 'src/domain/enums/trade-type.enum';
import { WorkerGroupWithCountPersistence } from 'src/infrastructure/types/worker-group.types';

@Injectable()
export class WorkerGroupRepository implements IWorkerGroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  private resolveClient(ctx?: ITransactionContext) {
    return RepositoryUtils.resolveClient(this.prisma, ctx);
  }

  private toProps(record: WorkerGroupWithCountPersistence): WorkerGroupProps {
    return {
      id: record.id,
      name: record.name,
      description: record.description ?? '',
      trade: record.trade as TradeType,
      createdById: record.createdById,
      isActive: record.isActive,
      workerCount: record.workerCount ?? 0,
      workers: [],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      isDeleted: record.isDeleted,
      deletedAt: record.deletedAt ?? undefined,
    };
  }

  async findById(
    id: string,
    context?: ITransactionContext,
  ): Promise<WorkerGroupEntity | null> {
    const client = this.resolveClient(context);
    const record = await client.workerGroup.findFirst({
      where: { id, isDeleted: false },
      include: {
        _count: {
          select: {
            workers: { where: { isActive: true, isDeleted: false } },
          },
        },
      },
    });

    if (!record) return null;

    return WorkerGroupMapper.toDomain(
      this.toProps({
        ...record,
        trade: record.trade as unknown as TradeType,
        workerCount: record._count.workers,
      } as WorkerGroupWithCountPersistence),
    );
  }

  async existsByName(
    name: string,
    excludeId?: string,
    context?: ITransactionContext,
  ): Promise<boolean> {
    const client = this.resolveClient(context);
    const count = await client.workerGroup.count({
      where: {
        name,
        isDeleted: false,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    return count > 0;
  }

  async isMemberInGroup(
    workerId: string,
    groupId: string,
    context?: ITransactionContext,
  ): Promise<boolean> {
    const client = this.resolveClient(context);
    const count = await client.workerGroupMember.count({
      where: {
        workerGroupId: groupId,
        workerId,
        isActive: true,
      },
    });
    return count > 0;
  }

  /**
   * Writer
   */
  async create(
    data: CreateWorkerGroupData,
    ctx?: ITransactionContext,
  ): Promise<WorkerGroupEntity> {
    const client = this.resolveClient(ctx);
    const record = await client.workerGroup.create({
      data: {
        name: data.name,
        description: data.description,
        trade: data.trade,
        createdById: data.createdById,
      },
      include: {
        _count: {
          select: {
            workers: { where: { isActive: true, isDeleted: false } },
          },
        },
      },
    });
    return WorkerGroupMapper.toDomain(
      this.toProps({
        ...record,
        trade: record.trade as unknown as TradeType,
        workerCount: record._count.workers,
      } as WorkerGroupWithCountPersistence),
    );
  }

  async update(
    id: string,
    data: UpdateWorkerGroupData,
    ctx?: ITransactionContext,
  ): Promise<WorkerGroupEntity> {
    const client = this.resolveClient(ctx);
    const record = await client.workerGroup.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        trade: data.trade,
        isActive: data.isActive,
      },
      include: {
        _count: {
          select: {
            workers: { where: { isActive: true, isDeleted: false } },
          },
        },
      },
    });

    return WorkerGroupMapper.toDomain(
      this.toProps({
        ...record,
        trade: record.trade as unknown as TradeType,
        workerCount: record._count.workers,
      } as WorkerGroupWithCountPersistence),
    );
  }

  async softDelete(id: string, ctx?: ITransactionContext): Promise<void> {
    const client = this.resolveClient(ctx);
    await client.workerGroup.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
  }

  async addMember(
    groupId: string,
    workerId: string,
    ctx?: ITransactionContext,
  ): Promise<void> {
    const client = this.resolveClient(ctx);
    await client.workerGroupMember.upsert({
      where: {
        workerGroupId_workerId: {
          workerGroupId: groupId,
          workerId,
        },
      },
      create: {
        workerGroupId: groupId,
        workerId,
        isActive: true,
      },
      update: {
        isActive: true,
      },
    });
  }

  async removeMember(
    groupId: string,
    workerId: string,
    ctx?: ITransactionContext,
  ): Promise<void> {
    const client = this.resolveClient(ctx);
    await client.workerGroupMember.update({
      where: { workerGroupId_workerId: { workerGroupId: groupId, workerId } },
      data: {
        isActive: false,
      },
    });
  }
}
