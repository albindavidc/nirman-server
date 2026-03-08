import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Project } from '../../../domain/entities/project.entity';
import { ProjectMapper } from '../../../application/mappers/project.mapper';
import { IProjectWriter } from '../../../domain/repositories/project/project.writer.interface';
import { IProjectReader } from '../../../domain/repositories/project/project.reader.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';
import { PrismaClient } from '../../../generated/client/client';

@Injectable()
export class ProjectRepository implements IProjectWriter, IProjectReader {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<Project | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const project = await client.project.findUnique({
        where: { id, is_deleted: false },
        include: { phases: { orderBy: { sequence: 'asc' } } },
      });
      return project ? ProjectMapper.fromPrismaResult(project) : null;
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
      const count = await client.project.count({
        where: { id, is_deleted: false },
      });
      return count > 0;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
      return false;
    }
  }

  async save(entity: Project, tx?: ITransactionContext): Promise<Project> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const createData = ProjectMapper.toPrismaCreateInput(entity);
      const updateData = ProjectMapper.toPrismaUpdateInput(entity);

      if (!createData.name) {
        throw new Error('Project name is required for creation');
      }

      const upserted = await client.project.upsert({
        where: { id: entity.id },
        update: updateData as unknown as NonNullable<
          Parameters<typeof client.project.upsert>[0]
        >['update'],
        create: createData as unknown as NonNullable<
          Parameters<typeof client.project.upsert>[0]
        >['create'],
        include: { phases: { orderBy: { sequence: 'asc' } } },
      });

      return ProjectMapper.fromPrismaResult(upserted);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async softDelete(id: string, tx?: ITransactionContext): Promise<void> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      await client.project.update({
        where: { id },
        data: {
          is_deleted: true,
          deleted_at: new Date(),
        },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
