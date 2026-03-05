import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProjectPhase } from '../../../domain/entities/project-phase.entity';
import { ProjectPhaseMapper } from '../../../application/mappers/project-phase.mapper';
import { IProjectPhaseQueryReader } from '../../../domain/repositories/project-phase/project-phase.query-reader.interface';
import { IProjectPhaseReader } from '../../../domain/repositories/project-phase/project-phase.reader.interface';
import { PhaseWithApprovals } from '../../../domain/repositories/project-phase/project-phase-repository.interface';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import { RepositoryUtils } from '../repository.utils';
import { ApprovalStatus } from '../../../domain/enums/approval-status.enum';

@Injectable()
export class ProjectPhaseQueryRepository
  implements IProjectPhaseQueryReader, IProjectPhaseReader
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx?: ITransactionContext,
  ): Promise<ProjectPhase | null> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const phase = await client.projectPhase.findUnique({
        where: { id },
      });
      return phase ? ProjectPhaseMapper.toDomain(phase) : null;
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async existsById(id: string, tx?: ITransactionContext): Promise<boolean> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
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
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const phases = await client.projectPhase.findMany({
        where: { project_id: projectId },
        orderBy: { sequence: 'asc' },
      });
      return phases.map((phase) => ProjectPhaseMapper.toDomain(phase));
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }

  async findWithApprovals(
    phaseId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseWithApprovals | null> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const phase = await client.projectPhase.findUnique({
        where: { id: phaseId },
        include: {
          project: {
            select: { id: true, name: true, budget: true, spent: true },
          },
          approvals: {
            include: {
              approver: { select: { first_name: true, last_name: true } },
              requester: { select: { first_name: true, last_name: true } },
            },
            orderBy: { created_at: 'desc' },
          },
          tasks: { select: { status: true } },
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
        approvals: phase.approvals.map((a) => ({
          id: a.id,
          phaseId: a.phase_id,
          approvedBy: a.approved_by,
          approverName: a.approver
            ? `${a.approver.first_name} ${a.approver.last_name}`
            : null,
          requestedBy: a.requested_by,
          requesterName: `${a.requester.first_name} ${a.requester.last_name}`,
          approvalStatus: a.approval_status as string as ApprovalStatus,
          comments: a.comments,
          media: (a.media as Array<{ type: string; url: string }>) ?? [],
          approvedAt: a.approved_at,
          createdAt: a.created_at,
        })),
        taskStats: {
          total: phase.tasks.length,
          completed: phase.tasks.filter((t) => t.status === 'Completed').length,
        },
      };
    } catch (error) {
      RepositoryUtils.handleError(error);
    }
  }
}
