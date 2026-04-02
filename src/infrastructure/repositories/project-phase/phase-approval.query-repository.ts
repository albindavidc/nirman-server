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
        where: { phaseId: phaseId },
        include: {
          approver: { select: { firstName: true, lastName: true } },
          requester: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
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
        where: { phaseId: phaseId },
        include: {
          approver: { select: { firstName: true, lastName: true } },
          requester: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return approvals.map(
        (
          a: Prisma.PhaseApprovalGetPayload<{
            include: {
              approver: { select: { firstName: true; lastName: true } };
              requester: { select: { firstName: true; lastName: true } };
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
        where: { phase: { projectId: projectId } },
        include: {
          approver: { select: { firstName: true, lastName: true } },
          requester: { select: { firstName: true, lastName: true } },
          phase: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      });

      return approvals.map(
        (
          a: Prisma.PhaseApprovalGetPayload<{
            include: {
              approver: { select: { firstName: true; lastName: true } };
              requester: { select: { firstName: true; lastName: true } };
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
          approver: { select: { firstName: true, lastName: true } },
          requester: { select: { firstName: true, lastName: true } },
          phase: {
            select: {
              name: true,
              project: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return approvals.map(
        (
          a: Prisma.PhaseApprovalGetPayload<{
            include: {
              approver: { select: { firstName: true; lastName: true } };
              requester: { select: { firstName: true; lastName: true } };
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
    phaseId: string;
    approvedBy: string | null;
    requestedBy: string;
    approvalStatus: PrismaApprovalStatus;
    comments: string | null;
    media: Prisma.JsonValue;
    approvedAt: Date | null;
    requestedAt: Date;
    createdAt: Date;
    approver: { firstName: string; lastName: string } | null;
    requester: { firstName: string; lastName: string };
  }): PhaseApprovalResult {
    return {
      id: approval.id,
      phaseId: approval.phaseId,
      approvedBy: approval.approvedBy,
      approverFirstName: approval.approver?.firstName ?? null,
      approverLastName: approval.approver?.lastName ?? null,
      requestedBy: approval.requestedBy,
      requesterFirstName: approval.requester.firstName,
      requesterLastName: approval.requester.lastName,
      approvalStatus: approval.approvalStatus as string as ApprovalStatus,
      comments: approval.comments,
      media: Array.isArray(approval.media)
        ? (approval.media as unknown as PhaseApprovalMedia[])
        : [],
      approvedAt: approval.approvedAt,
      requestedAt: approval.requestedAt,
      createdAt: approval.createdAt,
    };
  }

  private toResultWithPhase(
    approval: Prisma.PhaseApprovalGetPayload<{
      include: {
        approver: { select: { firstName: true; lastName: true } };
        requester: { select: { firstName: true; lastName: true } };
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
        approver: { select: { firstName: true; lastName: true } };
        requester: { select: { firstName: true; lastName: true } };
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
