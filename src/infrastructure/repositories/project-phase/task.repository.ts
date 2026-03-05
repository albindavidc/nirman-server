import { Injectable } from '@nestjs/common';
import { TaskMapper } from '../../../application/mappers/project-phase/task.mapper';
import {
  TaskDependencyEntity,
  TaskEntity,
  TaskStatus,
} from '../../../domain/entities/task.entity';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { ITaskWriter } from '../../../domain/repositories/project-phase/task.writer.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { RepositoryUtils } from '../repository.utils';

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

      // Prisma upsert requires a valid unique identifier in the `where` clause.
      // Our handlers pass an empty string for new entities, which leads to a
      // runtime error when Prisma tries to interpret that value as an ObjectId.
      // Instead of abusing upsert, split into create vs update paths.
      if (!entity.id) {
        const created = await client.task.create({
          data: input,
          include: { assignee: true },
        });
        return TaskMapper.toDomain(created);
      }

      const updated = await client.task.update({
        where: { id: entity.id },
        data: updateInput,
        include: { assignee: true },
      });
      return TaskMapper.toDomain(updated);
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

      if (!entity.id) {
        const created = await client.taskDependency.create({
          data: input,
        });
        return TaskMapper.dependencyToDomain(created);
      }

      const updated = await client.taskDependency.update({
        where: { id: entity.id },
        data: {
          lag_time: entity.lagTime,
          type: entity.type,
          notes: entity.notes,
        },
      });
      return TaskMapper.dependencyToDomain(updated);
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
