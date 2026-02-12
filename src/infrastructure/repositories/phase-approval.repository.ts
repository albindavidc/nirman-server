import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import {
  IPhaseApprovalRepository,
  CreatePhaseApprovalData,
  PhaseApprovalResult,
} from '../../domain/repositories/phase-approval-repository.interface';

import { PhaseApprovalWithUsers } from '../types/phase-approval.types';

@Injectable()
export class PhaseApprovalRepository implements IPhaseApprovalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByPhaseId(phaseId: string): Promise<PhaseApprovalResult[]> {
    const approvals = (await this.prisma.phaseApproval.findMany({
      where: { phase_id: phaseId },
      include: {
        approver: {
          select: { first_name: true, last_name: true },
        },
        requester: {
          select: { first_name: true, last_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    })) as PhaseApprovalWithUsers[];

    return approvals.map((a) => ({
      id: a.id,
      phaseId: a.phase_id,
      approvedBy: a.approved_by,
      approverFirstName: a.approver?.first_name ?? null,
      approverLastName: a.approver?.last_name ?? null,
      requestedBy: a.requested_by,
      requesterFirstName: a.requester.first_name,
      requesterLastName: a.requester.last_name,
      approvalStatus: a.approval_status,
      comments: a.comments,
      media: (a.media as Array<{ type: string; url: string }>) ?? [],
      approvedAt: a.approved_at,
      requestedAt: a.requested_at,
      createdAt: a.created_at,
    }));
  }

  async findLatestByPhaseId(
    phaseId: string,
  ): Promise<PhaseApprovalResult | null> {
    const approval = (await this.prisma.phaseApproval.findFirst({
      where: { phase_id: phaseId },
      include: {
        approver: {
          select: { first_name: true, last_name: true },
        },
        requester: {
          select: { first_name: true, last_name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    })) as PhaseApprovalWithUsers | null;

    if (!approval) {
      return null;
    }

    return {
      id: approval.id,
      phaseId: approval.phase_id,
      approvedBy: approval.approved_by,
      approverFirstName: approval.approver?.first_name ?? null,
      approverLastName: approval.approver?.last_name ?? null,
      requestedBy: approval.requested_by,
      requesterFirstName: approval.requester.first_name,
      requesterLastName: approval.requester.last_name,
      approvalStatus: approval.approval_status,
      comments: approval.comments,
      media: (approval.media as Array<{ type: string; url: string }>) ?? [],
      approvedAt: approval.approved_at,
      requestedAt: approval.requested_at,
      createdAt: approval.created_at,
    };
  }

  async findByProjectId(projectId: string): Promise<PhaseApprovalResult[]> {
    const approvals = (await this.prisma.phaseApproval.findMany({
      where: { phase: { project_id: projectId } },
      include: {
        approver: {
          select: { first_name: true, last_name: true },
        },
        requester: {
          select: { first_name: true, last_name: true },
        },
        phase: {
          select: { name: true },
        },
      },
      orderBy: { created_at: 'desc' },
    })) as PhaseApprovalWithUsers[];

    return approvals.map((a) => ({
      id: a.id,
      phaseId: a.phase_id,
      phaseName: a.phase!.name,
      approvedBy: a.approved_by,
      approverFirstName: a.approver?.first_name ?? null,
      approverLastName: a.approver?.last_name ?? null,
      requestedBy: a.requested_by,
      requesterFirstName: a.requester?.first_name,
      requesterLastName: a.requester?.last_name,
      approvalStatus: a.approval_status,
      comments: a.comments,
      media: (a.media as Array<{ type: string; url: string }>) ?? [],
      approvedAt: a.approved_at,
      requestedAt: a.requested_at,
      createdAt: a.created_at,
    }));
  }

  async create(data: CreatePhaseApprovalData): Promise<PhaseApprovalResult> {
    const approval = (await this.prisma.phaseApproval.create({
      data: {
        phase_id: data.phaseId,
        approved_by: data.approvedBy,
        requested_by: data.requestedBy,
        approval_status: data.approvalStatus,
        comments: data.comments,
        media: data.media,
        approved_at:
          data.approvalStatus === 'approved' ||
          data.approvalStatus === 'rejected'
            ? new Date()
            : null,
      },
      include: {
        approver: {
          select: { first_name: true, last_name: true },
        },
        requester: {
          select: { first_name: true, last_name: true },
        },
      },
    })) as PhaseApprovalWithUsers;

    return {
      id: approval.id,
      phaseId: approval.phase_id,
      approvedBy: approval.approved_by,
      approverFirstName: approval.approver?.first_name ?? null,
      approverLastName: approval.approver?.last_name ?? null,
      requestedBy: approval.requested_by,
      requesterFirstName: approval.requester?.first_name,
      requesterLastName: approval.requester?.last_name,
      approvalStatus: approval.approval_status,
      comments: approval.comments,
      media: (approval.media as Array<{ type: string; url: string }>) ?? [],
      approvedAt: approval.approved_at,
      requestedAt: approval.requested_at,
      createdAt: approval.created_at,
    };
  }
}
