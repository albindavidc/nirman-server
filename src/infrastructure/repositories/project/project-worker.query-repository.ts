import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IProjectWorkerQueryReader } from '../../../domain/repositories/project/project-worker.query-reader.interface';
import { ProjectWorkerWithUser } from '../../../domain/repositories/project/project-worker-repository.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';

interface MemberData {
  user_id: string;
  role: string;
  joined_at: Date;
  is_creator?: boolean;
}

@Injectable()
export class ProjectWorkerQueryRepository implements IProjectWorkerQueryReader {
  constructor(private readonly prisma: PrismaService) {}

  async findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<ProjectWorkerWithUser[]> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);

    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
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

      const members = project.members as unknown as MemberData[];

      // Get user details for all workers
      const userIds = members.map((m) => m.user_id);
      const users = await client.user.findMany({
        where: { id: { in: userIds } },
        include: {
          professional: true,
        },
      });

      // Map users to worker response
      return members.map((member) => {
        const user = users.find((u) => u.id === member.user_id);
        return {
          userId: member.user_id,
          role: member.role,
          joinedAt: member.joined_at,
          isCreator: member.is_creator ?? false,
          user: user
            ? {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                fullName: `${user.first_name} ${user.last_name}`,
                email: user.email,
                phone: user.phone_number,
                profilePhoto: user.profile_photo_url,
                title: user.professional?.professional_title || '',
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
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
      });

      if (!project) return false;

      const members = (project.members as unknown as MemberData[]) || [];
      return members.some((m) => m.user_id === userId);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async getWorkerIds(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<string[]> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const project = await client.project.findUnique({
        where: { id: projectId },
      });

      if (!project) return [];

      const members = (project.members as unknown as MemberData[]) || [];
      return members.map((m) => m.user_id);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }
}
