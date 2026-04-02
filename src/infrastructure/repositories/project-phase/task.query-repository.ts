import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ITaskQueryReader } from '../../../domain/repositories/project-phase/task.query-repository.interface';
import { ITaskReader } from '../../../domain/repositories/project-phase/task.reader.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import {
  TaskEntity,
  TaskDependencyEntity,
} from '../../../domain/entities/task.entity';
import { TaskMapper } from '../../../application/mappers/project-phase/task.mapper';
import { RepositoryUtils } from '../repository.utils';
import { PrismaClient } from '../../../generated/client/client';

@Injectable()
export class TaskQueryRepository implements ITaskQueryReader, ITaskReader {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<TaskEntity | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const found = await client.task.findUnique({
        where: { id },
        include: { assignee: true },
      });
      return found ? TaskMapper.toDomain(found) : null;
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
      const count = await client.task.count({
        where: { id },
      });
      return count > 0;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByPhaseId(phaseId: string): Promise<TaskEntity[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: { phaseId: phaseId },
        include: { assignee: true },
      });
      return tasks.map(TaskMapper.toDomain);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByProjectId(projectId: string): Promise<TaskEntity[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: { phase: { projectId: projectId } },
        include: { assignee: true },
      });
      return tasks.map(TaskMapper.toDomain);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByAssigneeId(userId: string): Promise<TaskEntity[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: { assignedTo: userId },
        include: { assignee: true },
      });
      return tasks.map(TaskMapper.toDomain);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findDependenciesByPhaseId(
    phaseId: string,
  ): Promise<TaskDependencyEntity[]> {
    try {
      const deps = await this.prisma.taskDependency.findMany({
        where: { phaseId: phaseId },
      });
      return deps.map(TaskMapper.dependencyToDomain);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findDependenciesByProjectId(
    projectId: string,
  ): Promise<TaskDependencyEntity[]> {
    try {
      const phases = await this.prisma.projectPhase.findMany({
        where: { projectId: projectId },
        select: { id: true },
      });
      const phaseIds = phases.map((p: { id: string }) => p.id);

      const deps = await this.prisma.taskDependency.findMany({
        where: { phaseId: { in: phaseIds } },
      });
      return deps.map(TaskMapper.dependencyToDomain);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
