import { Injectable } from '@nestjs/common';
import { TradeType } from 'src/domain/enums/trade-type.enum';
import { WorkerGroupMapper } from 'src/application/mappers/worker/worker-group/worker-group.mapper';
import { WorkerGroupProps } from 'src/domain/entities/worker-group.entity';
import {
  GetProjectGroupFilter,
  IWorkerGroupQueryReader,
} from 'src/domain/repositories/worker';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';
import {
  WorkerGroupWithCountPersistence,
  WorkerGroupWithMembersRaw,
} from 'src/infrastructure/types/worker-group.types';

@Injectable()
export class WorkerGroupQueryRepository implements IWorkerGroupQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByProject(
    filter: GetProjectGroupFilter,
  ): Promise<WorkerGroupProps[]> {
    const record = await this.prisma.workerGroup.findMany({
      where: {
        projectId: filter.projectId,
        isDeleted: false,
        ...(filter.trade && { trade: filter.trade }),
        ...(filter.isActive && { isActive: filter.isActive }),
        ...(filter.search && {
          name: {
            contains: filter.search,
            mode: 'insensitive',
          },
        }),
      },
      include: {
        _count: {
          select: {
            workers: { where: { isActive: true, isDeleted: false } },
          },
        },
      },
      orderBy: [
        {
          isActive: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return record.map((record) =>
      this.toProps({
        ...record,
        trade: record.trade as TradeType,
        workerCount: record._count.workers,
      } as WorkerGroupWithCountPersistence),
    );
  }

  private toProps(record: WorkerGroupWithCountPersistence): WorkerGroupProps {
    return {
      id: record.id,
      name: record.name,
      description: record.description ?? '',
      trade: record.trade as TradeType,
      projectId: record.projectId,
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

  async findByIdWithMembers(id: string): Promise<WorkerGroupProps | null> {
    const record = await this.prisma.workerGroup.findFirst({
      where: { id, isDeleted: false },
      include: {
        workers: {
          where: { isDeleted: false },
          include: {
            worker: {
              include: {
                user: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profilePhotoUrl: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!record) return null;

    return WorkerGroupMapper.toDomain(
      this.toMemberProps(record as WorkerGroupWithMembersRaw),
    );
  }

  async countByProject(filter: GetProjectGroupFilter): Promise<number> {
    return this.prisma.workerGroup.count({
      where: {
        projectId: filter.projectId,
        isDeleted: false,
        ...(filter.trade && { trade: filter.trade }),
        ...(filter.isActive && { isActive: filter.isActive }),
        ...(filter.search && {
          name: {
            contains: filter.search,
            mode: 'insensitive',
          },
        }),
      },
    });
  }

  private toMemberProps(record: WorkerGroupWithMembersRaw): WorkerGroupProps {
    const worker = record.workers.map((m) => ({
      id: m.id,
      groupId: m.workerGroupId,
      workerId: m.workerId,
      workerName: `${m.worker.user.firstName} ${m.worker.user.lastName}`,
      workerPhotoUrl: m.worker.user.profilePhotoUrl,
      isActive: m.isActive,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      isDeleted: m.isDeleted,
      deletedAt: m.deletedAt ?? undefined,
    }));

    const workerCount = record._count?.workers ?? worker.length;

    return {
      ...this.toProps({
        ...record,
        workerCount,
      } as WorkerGroupWithCountPersistence),
      workerCount,
      workers: worker,
    };
  }
}
