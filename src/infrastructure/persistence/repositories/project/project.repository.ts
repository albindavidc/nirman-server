import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IProjectRepository } from '../../../../domain/repositories/project-repository.interface';
import { BaseRepository } from '../../base.repository';
import { Project } from '../../../../domain/entities/project.entity';
import { ProjectMapper } from './project.mapper';
import { Prisma, ProjectStatus } from '../../../../generated/client/client';

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
      include: { creator: true },
      orderBy: { created_at: 'desc' },
    });
    return projects.map((p) => ProjectMapper.persistenceToEntity(p));
  }

  async findById(id: string): Promise<Project | null> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: { creator: true },
    });
    return project ? ProjectMapper.persistenceToEntity(project) : null;
  }

  async findByCreator(userId: string): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: { created_by: userId },
      include: { creator: true },
      orderBy: { created_at: 'desc' },
    });
    return projects.map((p) => ProjectMapper.persistenceToEntity(p));
  }

  async findAllWithFilters(params: {
    search?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ projects: Project[]; total: number }> {
    const { search, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {};

    if (status) {
      where.status = status as ProjectStatus;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [projects, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        include: { creator: true },
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      projects: projects.map((p) => ProjectMapper.persistenceToEntity(p)),
      total,
    };
  }

  async create(data: Partial<Project>): Promise<Project> {
    const persistenceData = ProjectMapper.entityToPersistence(data);
    const {
      creator: _creator,
      id: _id,
      ...createData
    } = persistenceData as {
      creator?: unknown;
      id?: string;
    };
    void _creator;
    void _id;

    const created = await this.prisma.project.create({
      data: createData as Prisma.ProjectCreateInput,
      include: { creator: true },
    });

    return ProjectMapper.persistenceToEntity(created);
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const persistenceData = ProjectMapper.entityToPersistence(data);
    const {
      creator: _creator,
      id: _id,
      created_by: _createdBy,
      ...updateData
    } = persistenceData as {
      creator?: unknown;
      id?: string;
      created_by?: string;
    };
    void _creator;
    void _id;
    void _createdBy;

    // Clean undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    await this.prisma.project.update({
      where: { id },
      data: updateData as Prisma.ProjectUpdateInput,
    });

    return (await this.findById(id))!;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.project.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.project.count({ where: { id } });
    return count > 0;
  }

  async count(): Promise<number> {
    return this.prisma.project.count();
  }

  async countByStatus(status: string): Promise<number> {
    return this.prisma.project.count({
      where: { status: status as ProjectStatus },
    });
  }
}
