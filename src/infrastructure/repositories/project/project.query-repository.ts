import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IProjectQueryReader } from '../../../domain/repositories/project/project.query-reader.interface';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectMapper } from '../../../application/mappers/project.mapper';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';
import { ProjectWherePersistenceInput } from '../../types/project.types';
import { ProjectStatus } from '../../../domain/enums/project-status.enum';
import { PrismaClient, Prisma } from '../../../generated/client/client';

@Injectable()
export class ProjectQueryRepository implements IProjectQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tx?: ITransactionContext): Promise<Project[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const projects = await client.project.findMany({
        where: { isDeleted: false },
        include: { phases: { orderBy: { sequence: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      });
      return ProjectMapper.fromPrismaResults(projects);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findAllWithFilters(
    params: {
      search?: string;
      status?: string;
      page: number;
      limit: number;
    },
    tx?: ITransactionContext,
  ): Promise<{ projects: Project[]; total: number }> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const { search, status, page, limit } = params;
      const skip = (page - 1) * limit;

      const where: ProjectWherePersistenceInput = {
        isDeleted: false,
      };

      if (status) {
        where.status = status as ProjectStatus;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const prismaWhere = ProjectMapper.toPrismaWhereInput(where);

      const [projects, total] = await Promise.all([
        client.project.findMany({
          where: prismaWhere as Prisma.ProjectWhereInput,
          skip,
          take: limit,
          include: { phases: { orderBy: { sequence: 'asc' } } },
          orderBy: { createdAt: 'desc' },
        }),
        client.project.count({
          where: prismaWhere as Prisma.ProjectWhereInput,
        }),
      ]);

      return {
        projects: ProjectMapper.fromPrismaResults(projects),
        total,
      };
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByCreator(
    userId: string,
    tx?: ITransactionContext,
  ): Promise<Project[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const projects = await client.project.findMany({
        where: {
          members: {
            some: { userId: userId, isCreator: true },
          },
          isDeleted: false,
        },
        include: { phases: { orderBy: { sequence: 'asc' } } },
        orderBy: { createdAt: 'desc' },
      });
      return ProjectMapper.fromPrismaResults(projects);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async count(tx?: ITransactionContext): Promise<number> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      return await client.project.count({
        where: { isDeleted: false },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async countByStatus(
    status: string,
    tx?: ITransactionContext,
  ): Promise<number> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const where: ProjectWherePersistenceInput = {
        status: status as ProjectStatus,
        isDeleted: false,
      };
      const prismaWhere = ProjectMapper.toPrismaWhereInput(where);
      return await client.project.count({
        where: prismaWhere as Prisma.ProjectWhereInput,
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async getAggregatedBudget(tx?: ITransactionContext): Promise<{
    totalBudget: number;
    totalSpent: number;
  }> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const budgetData = await client.project.aggregate({
        where: { isDeleted: false },
        _sum: {
          budget: true,
          spent: true,
        },
      });

      return {
        totalBudget: budgetData._sum.budget ?? 0,
        totalSpent: budgetData._sum.spent ?? 0,
      };
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
