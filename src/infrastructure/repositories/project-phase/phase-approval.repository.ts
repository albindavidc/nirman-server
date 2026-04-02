import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '../../../generated/client/client';
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
    const client = RepositoryUtils.resolveClient(
      this.prisma,
      tx,
    ) as PrismaClient;
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
        approvalStatus: data.approvalStatus as string as PrismaApprovalStatus,
        comments: data.comments,
        media: data.media as unknown as Prisma.InputJsonValue,
        approvedAt: isDecided ? new Date() : null,
      };

      const approval = await client.phaseApproval.create({
        data: createInput,
        include: {
          approver: { select: { firstName: true, lastName: true } },
          requester: { select: { firstName: true, lastName: true } },
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
}
