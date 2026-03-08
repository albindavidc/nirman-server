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
  user_id: string;
  role: string;
  joined_at: Date;
  is_creator?: boolean;
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
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      const existingMembers =
        (project.members as unknown as MemberData[]) || [];
      const existingWorkerIds = existingMembers.map((m) => m.user_id);

      const newWorkers = workers.filter(
        (m) => !existingWorkerIds.includes(m.userId),
      );

      if (newWorkers.length === 0) {
        return {
          addedCount: 0,
          workers: existingMembers.map((m) => ({
            userId: m.user_id,
            role: m.role,
            joinedAt: m.joined_at,
            isCreator: m.is_creator ?? false,
          })),
        };
      }

      const newWorkerEntries = newWorkers.map((worker) => ({
        user_id: worker.userId,
        role: worker.role,
        joined_at: new Date(),
        is_creator: false,
      }));

      const updatedProject = await client.project.update({
        where: { id: projectId },
        data: {
          members: {
            push: newWorkerEntries,
          },
        },
      });

      const updatedMembers =
        (updatedProject.members as unknown as MemberData[]) || [];
      return {
        addedCount: newWorkers.length,
        workers: updatedMembers.map((m) => ({
          userId: m.user_id,
          role: m.role,
          joinedAt: m.joined_at,
          isCreator: m.is_creator ?? false,
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
      });

      if (!project) {
        throw new NotFoundException(`Project with ID ${projectId} not found`);
      }

      const members = (project.members as unknown as MemberData[]) || [];
      const workerIndex = members.findIndex((m) => m.user_id === userId);
      if (workerIndex === -1) {
        throw new NotFoundException('User is not a worker of this project');
      }

      const updatedMembers = members.filter((m) => m.user_id !== userId);

      const updatedProject = await client.project.update({
        where: { id: projectId },
        data: {
          members: updatedMembers as unknown as Prisma.InputJsonValue,
        },
      });

      const finalMembers =
        (updatedProject.members as unknown as MemberData[]) || [];
      return finalMembers.map((m) => ({
        userId: m.user_id,
        role: m.role,
        joinedAt: m.joined_at,
        isCreator: m.is_creator ?? false,
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
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const members = (project.members as unknown as MemberData[]) || [];
      const workerIndex = members.findIndex((m) => m.user_id === userId);
      if (workerIndex === -1) {
        throw new NotFoundException('Worker not found in project');
      }

      const updatedMembers = [...members];
      updatedMembers[workerIndex] = {
        ...updatedMembers[workerIndex],
        role,
      };

      await client.project.update({
        where: { id: projectId },
        data: {
          members: updatedMembers as unknown as Prisma.InputJsonValue,
        },
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
