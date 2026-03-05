import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ITaskWriter } from '../../../domain/repositories/project-phase/task.writer.interface';
import {
  TaskEntity,
  TaskDependencyEntity,
  TaskStatus,
} from '../../../domain/entities/task.entity';
import { TaskMapper } from '../../../application/mappers/project-phase/task.mapper';
import { RepositoryUtils } from '../repository.utils';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';

@Injectable()
export class TaskRepository implements ITaskWriter {
  constructor(private readonly prisma: PrismaService) {}

  async save(
    entity: TaskEntity,
    tx?: ITransactionContext,
  ): Promise<TaskEntity> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const input = TaskMapper.toCreateInput(entity);
      const updateInput = TaskMapper.toUpdateInput(entity);

      const upserted = await client.task.upsert({
        where: { id: entity.id || '' },
        create: input,
        update: updateInput,
        include: { assignee: true },
      });
      return TaskMapper.toDomain(upserted);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async softDelete(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      await client.task.update({
        where: { id },
        data: { status: TaskStatus.DELETED },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async addDependency(
    entity: TaskDependencyEntity,
    tx?: ITransactionContext,
  ): Promise<TaskDependencyEntity> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const input = TaskMapper.dependencyToCreateInput(entity);
      // Prisma does not support upsert without unique identifier if id is not unique, but id is unique string.
      const upserted = await client.taskDependency.upsert({
        where: { id: entity.id || '' },
        create: input,
        update: {
          lag_time: entity.lagTime,
          type: entity.type,
          notes: entity.notes,
        },
      });
      return TaskMapper.dependencyToDomain(upserted);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async removeDependency(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      await client.taskDependency.delete({
        where: { id },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
