import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IProjectWorkerWriter } from '../../../domain/repositories/project/project-worker.writer.interface';
import {
  ProjectWorkerData,
  AddWorkerData,
} from '../../../domain/repositories/project/project-worker-repository.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';
import { PrismaClient, Prisma } from '../../../generated/client/client';

// Local interface to strictly type the JSON elements stored in the array
interface MemberData {
  userId: string;
  role: string;
  joinedAt: Date;
  isCreator?: boolean;
}

@Injectable()
export class ProjectWorkerRepository implements IProjectWorkerWriter {
  constructor(private readonly prisma: PrismaService) {}

  async addWorkers(
    projectId: string,
    workers: AddWorkerData[],
    tx?: ITransactionContext,
  ): Promise<{ addedCount: number; workers: ProjectWorkerData[] }> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      const existingMembers =
        (project.members as unknown as MemberData[]) || [];
      const existingWorkerIds = existingMembers.map((m) => m.userId);

      const newWorkers = workers.filter(
        (m) => !existingWorkerIds.includes(m.userId),
      );

      if (newWorkers.length === 0) {
        return {
          addedCount: 0,
          workers: existingMembers.map((m) => ({
            userId: m.userId,
            role: m.role as string,
            joinedAt: m.joinedAt,
            isCreator: m.isCreator ?? false,
          })),
        };
      }

      const newWorkerEntries = newWorkers.map((worker) => ({
        userId: worker.userId,
        role: worker.role as any,
        joinedAt: new Date(),
        isCreator: false,
      }));

      const updatedProject = await client.project.update({
        where: { id: projectId },
        data: {
          members: {
            create: newWorkerEntries,
          },
        },
        include: { members: true },
      });

      const updatedMembers = updatedProject.members || [];
      return {
        addedCount: newWorkers.length,
        workers: updatedMembers.map((m) => ({
          userId: m.userId,
          role: m.role as string,
          joinedAt: m.joinedAt,
          isCreator: m.isCreator ?? false,
        })),
      };
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async removeWorker(
    projectId: string,
    userId: string,
    tx?: ITransactionContext,
  ): Promise<ProjectWorkerData[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      const members = (project.members as unknown as MemberData[]) || [];
      const workerIndex = members.findIndex((m) => m.userId === userId);
      if (workerIndex === -1) {
        throw new NotFoundException('User is not a worker of this project');
      }

      const updatedProject = await client.project.update({
        where: { id: projectId },
        data: {
          members: {
            deleteMany: { userId },
          },
        },
        include: { members: true },
      });

      const finalMembers = updatedProject.members || [];
      return finalMembers.map((m) => ({
        userId: m.userId,
        role: m.role as string,
        joinedAt: m.joinedAt,
        isCreator: m.isCreator ?? false,
      }));
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async updateWorkerRole(
    projectId: string,
    userId: string,
    role: string,
    tx?: ITransactionContext,
  ): Promise<void> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const members = (project.members as unknown as MemberData[]) || [];
      const workerIndex = members.findIndex((m) => m.userId === userId);
      if (workerIndex === -1) {
        throw new NotFoundException('Worker not found in project');
      }

      await client.projectMember.updateMany({
        where: { projectId, userId },
        data: {
          role: role as any,
        },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
