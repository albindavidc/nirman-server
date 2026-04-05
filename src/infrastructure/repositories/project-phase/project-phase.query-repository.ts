import { PrismaService } from '../../prisma/prisma.service';
import { ProjectPhase } from '../../../domain/entities/project-phase.entity';
import { ProjectPhaseMapper } from '../../../application/mappers/project-phase.mapper';
import { IProjectPhaseQueryReader } from '../../../domain/repositories/project-phase/project-phase.query-reader.interface';
import { IProjectPhaseReader } from '../../../domain/repositories/project-phase/project-phase.reader.interface';
import { PhaseWithApprovals } from '../../../domain/repositories/project-phase/project-phase-repository.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';
import { ApprovalStatus } from '../../../domain/enums/approval-status.enum';
import { Prisma, PrismaClient } from '../../../generated/client/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectPhaseQueryRepository
  implements IProjectPhaseQueryReader, IProjectPhaseReader
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<ProjectPhase | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const phase = await client.projectPhase.findUnique({
        where: { id },
        include: { workerGroups: { include: { workerGroup: true } } },
      });
      return phase ? ProjectPhaseMapper.toDomain(phase) : null;
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
      const count = await client.projectPhase.count({
        where: { id },
      });
      return count > 0;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<ProjectPhase[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const phases = await client.projectPhase.findMany({
        where: { projectId: projectId },
        include: { workerGroups: { include: { workerGroup: true } } },
        orderBy: { sequence: 'asc' },
      });
      return phases.map(ProjectPhaseMapper.toDomain);
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }

  async findWithApprovals(
    phaseId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseWithApprovals | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const phase = await client.projectPhase.findUnique({
        where: { id: phaseId },
        include: {
          project: {
            select: { id: true, name: true, budget: true, spent: true },
          },
          approvals: {
            include: {
              approver: { select: { firstName: true, lastName: true } },
              requester: { select: { firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
          },
          tasks: { select: { status: true } },
          workerGroups: { include: { workerGroup: true } },
        },
      });

      if (!phase) return null;

      return {
        phase: ProjectPhaseMapper.toDomain(phase),
        project: {
          id: phase.project.id,
          name: phase.project.name,
          budget: phase.project.budget,
          spent: phase.project.spent,
        },
        approvals: phase.approvals.map(
          (
            a: Prisma.PhaseApprovalGetPayload<{
              include: {
                approver: { select: { firstName: true; lastName: true } };
                requester: { select: { firstName: true; lastName: true } };
              };
            }>,
          ) => ({
            id: a.id,
            phaseId: a.phaseId,
            approvedBy: a.approvedBy,
            approverName: a.approver
              ? `${a.approver.firstName} ${a.approver.lastName}`
              : null,
            requestedBy: a.requestedBy,
            requesterName: `${a.requester.firstName} ${a.requester.lastName}`,
            approvalStatus: a.approvalStatus as string as ApprovalStatus,
            comments: a.comments,
            media: (a.media as Array<{ type: string; url: string }>) ?? [],
            approvedAt: a.approvedAt,
            createdAt: a.createdAt,
          }),
        ),
        taskStats: {
          total: phase.tasks.length,
          completed: phase.tasks.filter(
            (t: { status: string }) => t.status === 'Completed',
          ).length,
        },
      };
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }
}
