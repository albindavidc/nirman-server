import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/client/client';
import { IProjectRepository } from '../../domain/repositories/project-repository.interface';
import { BaseRepository } from './base.repository';
import { Project } from '../../domain/entities/project.entity';
import { ProjectMapper } from '../mappers/project.mapper';
import { ProjectWherePersistenceInput } from '../types/project.types';
import { ProjectStatus } from '../../domain/enums/project-status.enum';

@Injectable()
export class ProjectRepository
  extends BaseRepository<Project>
  implements IProjectRepository
{
  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async findAll(): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { is_deleted: false },
      include: { phases: { orderBy: { sequence: 'asc' } } },
      orderBy: { created_at: 'desc' },
    });
    return ProjectMapper.fromPrismaResults(projects);
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findFirst({
      where: { id, is_deleted: false },
      include: { phases: { orderBy: { sequence: 'asc' } } },
    });
    return project ? ProjectMapper.fromPrismaResult(project) : null;
  }

  async findByCreator(userId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        members: {
          some: {
            user_id: userId,
            is_creator: true,
          },
        },
        is_deleted: false,
      },
      include: { phases: { orderBy: { sequence: 'asc' } } },
      orderBy: { created_at: 'desc' },
    });
    return ProjectMapper.fromPrismaResults(projects);
  }

  async findAllWithFilters(params: {
    search?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ projects: Project[]; total: number }> {
    const { search, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: ProjectWherePersistenceInput = {
      is_deleted: false,
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
      this.prisma.project.findMany({
        where: prismaWhere as Prisma.ProjectWhereInput,
        skip,
        take: limit,
        include: { phases: { orderBy: { sequence: 'asc' } } },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.project.count({
        where: prismaWhere as Prisma.ProjectWhereInput,
      }),
    ]);

    return {
      projects: ProjectMapper.fromPrismaResults(projects),
      total,
    };
  }

  async create(data: Partial<Project>): Promise<Project> {
    const prismaData = ProjectMapper.toPrismaCreateInput(data);

    if (!prismaData.name) {
      throw new Error('Project name is required for creation');
    }

    const created = await this.prisma.project.create({
      data: prismaData as Prisma.ProjectCreateInput,
      include: { phases: true },
    });

    return ProjectMapper.fromPrismaResult(created);
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const prismaData = ProjectMapper.toPrismaUpdateInput(data);

    await this.prisma.project.update({
      where: { id },

      data: prismaData as Prisma.ProjectUpdateInput,
    });

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.update({
      where: { id },
      data: {
        is_deleted: true,
        deleted_at: new Date(),
      },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.project.count({
      where: { id, is_deleted: false },
    });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.project.count({
      where: { is_deleted: false },
    });
  }

  async countByStatus(status: string): Promise<number> {
    const where: ProjectWherePersistenceInput = {
      status: status as ProjectStatus,
      is_deleted: false,
    };
    const prismaWhere = ProjectMapper.toPrismaWhereInput(where);
    return this.prisma.project.count({
      where: prismaWhere as Prisma.ProjectWhereInput,
    });
  }

  async getAggregatedBudget(): Promise<{
    totalBudget: number;
    totalSpent: number;
  }> {
    const budgetData = await this.prisma.project.aggregate({
      where: { is_deleted: false },
      _sum: {
        budget: true,
        spent: true,
      },
    });

    return {
      totalBudget: budgetData._sum.budget ?? 0,
      totalSpent: budgetData._sum.spent ?? 0,
    };
  }
}
