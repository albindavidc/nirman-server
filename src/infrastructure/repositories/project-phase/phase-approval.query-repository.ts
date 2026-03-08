import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, PrismaClient } from '../../../generated/client/client';
import { RepositoryUtils } from '../repository.utils';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import {
  IPhaseApprovalQueryReader,
  IPhaseApprovalReader,
  PhaseApprovalResult,
  PhaseApprovalMedia,
} from '../../../domain/repositories/project-phase/phase-approval-repository.interface';
import { ApprovalStatus } from '../../../domain/enums/approval-status.enum';
import { ApprovalStatus as PrismaApprovalStatus } from '../../../generated/client/client';

/**
 * PhaseApprovalQueryRepository — Query repository (SRP: read-only)
 *
 * Handles all paginated queries, projections, and bulk reads.
 * Never performs writes.
 */
@Injectable()
export class PhaseApprovalQueryRepository
  implements IPhaseApprovalQueryReader, IPhaseApprovalReader
{
  constructor(private readonly prisma: PrismaService) {}

  async findLatestByPhaseId(
    phaseId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult | null> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const approval = await client.phaseApproval.findFirst({
        where: { phase_id: phaseId },
        include: {
          approver: { select: { first_name: true, last_name: true } },
          requester: { select: { first_name: true, last_name: true } },
        },
        orderBy: { created_at: 'desc' },
      });

      if (!approval) {
        return null;
      }

      return this.toResult(approval);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByPhaseId(
    phaseId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const approvals = await client.phaseApproval.findMany({
        where: { phase_id: phaseId },
        include: {
          approver: { select: { first_name: true, last_name: true } },
          requester: { select: { first_name: true, last_name: true } },
        },
        orderBy: { created_at: 'desc' },
      });

      return approvals.map(
        (
          a: Prisma.PhaseApprovalGetPayload<{
            include: {
              approver: { select: { first_name: true; last_name: true } };
              requester: { select: { first_name: true; last_name: true } };
            };
          }>,
        ) => this.toResult(a),
      );
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findByProjectId(
    projectId: string,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const approvals = await client.phaseApproval.findMany({
        where: { phase: { project_id: projectId } },
        include: {
          approver: { select: { first_name: true, last_name: true } },
          requester: { select: { first_name: true, last_name: true } },
          phase: { select: { name: true } },
        },
        orderBy: { created_at: 'desc' },
      });

      return approvals.map(
        (
          a: Prisma.PhaseApprovalGetPayload<{
            include: {
              approver: { select: { first_name: true; last_name: true } };
              requester: { select: { first_name: true; last_name: true } };
              phase: { select: { name: true } };
            };
          }>,
        ) => this.toResultWithPhase(a),
      );
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  async findAll(tx?: ITransactionContext): Promise<PhaseApprovalResult[]> {
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
    try {
      const approvals = await client.phaseApproval.findMany({
        include: {
          approver: { select: { first_name: true, last_name: true } },
          requester: { select: { first_name: true, last_name: true } },
          phase: {
            select: {
              name: true,
              project: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });

      return approvals.map(
        (
          a: Prisma.PhaseApprovalGetPayload<{
            include: {
              approver: { select: { first_name: true; last_name: true } };
              requester: { select: { first_name: true; last_name: true } };
              phase: {
                select: {
                  name: true;
                  project: { select: { id: true; name: true } };
                };
              };
            };
          }>,
        ) => this.toResultWithPhaseAndProject(a),
      );
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  // ─── Mappers ──────────────────────────────────────────────────────────────

  private toResult(approval: {
    id: string;
    phase_id: string;
    approved_by: string | null;
    requested_by: string;
    approval_status: PrismaApprovalStatus;
    comments: string | null;
    media: Prisma.JsonValue;
    approved_at: Date | null;
    requested_at: Date;
    created_at: Date;
    approver: { first_name: string; last_name: string } | null;
    requester: { first_name: string; last_name: string };
  }): PhaseApprovalResult {
    return {
      id: approval.id,
      phaseId: approval.phase_id,
      approvedBy: approval.approved_by,
      approverFirstName: approval.approver?.first_name ?? null,
      approverLastName: approval.approver?.last_name ?? null,
      requestedBy: approval.requested_by,
      requesterFirstName: approval.requester.first_name,
      requesterLastName: approval.requester.last_name,
      approvalStatus: approval.approval_status as string as ApprovalStatus,
      comments: approval.comments,
      media: Array.isArray(approval.media)
        ? (approval.media as unknown as PhaseApprovalMedia[])
        : [],
      approvedAt: approval.approved_at,
      requestedAt: approval.requested_at,
      createdAt: approval.created_at,
    };
  }

  private toResultWithPhase(
    approval: Prisma.PhaseApprovalGetPayload<{
      include: {
        approver: { select: { first_name: true; last_name: true } };
        requester: { select: { first_name: true; last_name: true } };
        phase: { select: { name: true } };
      };
    }>,
  ): PhaseApprovalResult {
    const result = this.toResult(approval);
    result.phaseName = approval.phase.name;
    return result;
  }

  private toResultWithPhaseAndProject(
    approval: Prisma.PhaseApprovalGetPayload<{
      include: {
        approver: { select: { first_name: true; last_name: true } };
        requester: { select: { first_name: true; last_name: true } };
        phase: {
          select: {
            name: true;
            project: { select: { id: true; name: true } };
          };
        };
      };
    }>,
  ): PhaseApprovalResult {
    const result = this.toResult(approval);
    result.phaseName = approval.phase.name;
    result.projectId = approval.phase.project.id;
    result.projectName = approval.phase.project.name;
    return result;
  }
}
