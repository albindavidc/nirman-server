import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/client/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RepositoryUtils } from '../repository.utils';
import { ITransactionContext } from '../../../domain/interfaces/transaction-context.interface';
import {
  IPhaseApprovalWriter,
  CreatePhaseApprovalData,
  PhaseApprovalResult,
  PhaseApprovalMedia,
} from '../../../domain/repositories/project-phase/phase-approval-repository.interface';
import { ApprovalStatus } from '../../../domain/enums/approval-status.enum';
import { ApprovalStatus as PrismaApprovalStatus } from '../../../generated/client/client';

/**
 * PhaseApprovalRepository — Write repository (SRP: write + point-lookup only)
 *
 * Implements:
 *   IPhaseApprovalReader  — findLatestByPhaseId
 *   IPhaseApprovalWriter  — create
 *
 * All bulk / paginated reads live in PhaseApprovalQueryRepository.
 */
@Injectable()
export class PhaseApprovalRepository implements IPhaseApprovalWriter {
  constructor(private readonly prisma: PrismaService) {}

  // ─── IPhaseApprovalWriter ─────────────────────────────────────────────────

  async create(
    data: CreatePhaseApprovalData,
    tx?: ITransactionContext,
  ): Promise<PhaseApprovalResult> {
    const client = RepositoryUtils.resolveClient(this.prisma, tx);
    try {
      const isDecided =
        data.approvalStatus === ApprovalStatus.APPROVED ||
        data.approvalStatus === ApprovalStatus.REJECTED;

      const createInput: Prisma.PhaseApprovalCreateInput = {
        phase: { connect: { id: data.phaseId } },
        approver: data.approvedBy
          ? { connect: { id: data.approvedBy } }
          : undefined,
        requester: { connect: { id: data.requestedBy } },
        approval_status: data.approvalStatus as string as PrismaApprovalStatus,
        comments: data.comments,
        media: data.media,
        approved_at: isDecided ? new Date() : null,
      };

      const approval = await client.phaseApproval.create({
        data: createInput,
        include: {
          approver: { select: { first_name: true, last_name: true } },
          requester: { select: { first_name: true, last_name: true } },
        },
      });

      return this.toResult(approval);
    } catch (error: unknown) {
      RepositoryUtils.handleError(error);
    }
  }

  // ─── Private mapper ───────────────────────────────────────────────────────

  private toResult(approval: {
    id: string;
    phase_id: string;
    approved_by: string | null;
    requested_by: string;
    approval_status: PrismaApprovalStatus;
    comments: string | null;
    media: PhaseApprovalMedia[];
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
      media: approval.media || [],
      approvedAt: approval.approved_at,
      requestedAt: approval.requested_at,
      createdAt: approval.created_at,
    };
  }
}
