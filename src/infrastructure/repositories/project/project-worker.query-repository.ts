import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IProjectWorkerQueryReader } from '../../../domain/repositories/project/project-worker.query-reader.interface';
import { ProjectWorkerWithUser } from '../../../domain/repositories/project/project-worker-repository.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';
import { Prisma, PrismaClient } from '../../../generated/client/client';

interface MemberData {
  userId: string;
  role: string;
  joinedAt: Date;
  isCreator?: boolean;
}

@Injectable()
export class ProjectWorkerQueryRepository implements IProjectWorkerQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<ProjectWorkerWithUser[]> {
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

      if (
        !project.members ||
        !Array.isArray(project.members) ||
        project.members.length === 0
      ) {
        return [];
      }

      const members = project.members.map((m: any) => ({
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt,
        isCreator: m.isCreator,
      })) as MemberData[];

      // Get user details for all workers, filtering out any undefined/null IDs
      const userIds = members
        .map((m) => m.userId)
        .filter((id): id is string => !!id);

      const users = await client.user.findMany({
        where: { id: { in: userIds } },
        include: {
          professional: true,
        },
      });

      // Map users to worker response
      return members.map((member) => {
        const user = users.find(
          (u: Prisma.UserGetPayload<{ include: { professional: true } }>) =>
            u.id === member.userId,
        );
        return {
          userId: member.userId,
          role: member.role,
          joinedAt: member.joinedAt,
          isCreator: member.isCreator ?? false,
          user: user
            ? {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: `${user.firstName} ${user.lastName}`,
                email: user.email,
                phone: user.phoneNumber,
                profilePhoto: user.profilePhotoUrl,
                title: user.professional?.professionalTitle || '',
              }
            : null,
        };
      });
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async isWorker(
    projectId: string,
    userId: string,
    tx?: ITransactionContext,
  ): Promise<boolean> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      });

      if (!project) return false;

      const members = (project.members as unknown as MemberData[]) || [];
      return members.some((m) => m.userId === userId);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async getWorkerIds(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<string[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
        include: { members: true },
      });

      if (!project) return [];

      const members = (project.members as unknown as MemberData[]) || [];
      return members.map((m) => m.userId);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
