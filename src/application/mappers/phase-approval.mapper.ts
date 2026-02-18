import {
  PhaseApproval,
  MediaItem,
} from '../../domain/entities/phase-approval.entity';
import { PhaseApprovalResponseDto } from '../dto/phase-approval/phase-approval-response.dto';
import { PhaseApprovalResult } from '../../domain/repositories/phase-approval-repository.interface';

type PrismaPhaseApproval = {
  id: string;
  phase_id: string;
  approved_by: string | null;
  requested_by: string;
  approval_status: string;
  comments: string | null;
  media: { type: string; url: string }[];
  approved_at: Date | null;
  requested_at: Date;
  created_at: Date;
  updated_at: Date;
  approver?: { first_name: string; last_name: string };
  requester?: { first_name: string; last_name: string };
};

export class PhaseApprovalMapper {
  static toDomain(prisma: PrismaPhaseApproval): PhaseApproval {
    return new PhaseApproval(
      prisma.id,
      prisma.phase_id,
      prisma.requested_by,
      prisma.approved_by,
      prisma.approval_status,
      prisma.comments,
      prisma.media as MediaItem[],
      prisma.approved_at,
      prisma.created_at,
      prisma.updated_at,
    );
  }

  static toDto(prisma: PrismaPhaseApproval): PhaseApprovalResponseDto {
    return {
      id: prisma.id,
      phaseId: prisma.phase_id,
      approvedBy: prisma.approved_by,
      approverName: prisma.approver
        ? `${prisma.approver.first_name} ${prisma.approver.last_name}`
        : null,
      requestedBy: prisma.requested_by,
      requesterName: prisma.requester
        ? `${prisma.requester.first_name} ${prisma.requester.last_name}`
        : 'Unknown',
      approvalStatus: prisma.approval_status,
      comments: prisma.comments,
      media: prisma.media,
      approvedAt: prisma.approved_at?.toISOString() ?? null,
      requestedAt: prisma.requested_at?.toISOString(),
      createdAt: prisma.created_at.toISOString(),
      updatedAt: prisma.updated_at.toISOString(),
    };
  }

  static toDtoFromResult(
    this: void,
    result: PhaseApprovalResult,
  ): PhaseApprovalResponseDto {
    return {
      id: result.id,
      phaseId: result.phaseId,
      projectId: result.projectId,
      projectName: result.projectName,
      approvedBy: result.approvedBy,
      approverName: result.approverFirstName
        ? `${result.approverFirstName} ${result.approverLastName}`
        : null,
      requestedBy: result.requestedBy,
      requesterName: `${result.requesterFirstName} ${result.requesterLastName}`,
      approvalStatus: result.approvalStatus,
      comments: result.comments,
      media: result.media,
      approvedAt: result.approvedAt?.toISOString() ?? null,
      requestedAt: result.requestedAt?.toISOString(),
      createdAt: result.createdAt.toISOString(),
      updatedAt: result.createdAt.toISOString(), // Use createdAt as fallback
    };
  }

  static toDtoFromApproval(approval: {
    id: string;
    phaseId: string;
    approvedBy: string | null;
    approverName: string | null;
    requestedBy: string;
    requesterName: string;
    approvalStatus: string;
    comments: string | null;
    media: Array<{ type: string; url: string }>;
    approvedAt: Date | null;
    requestedAt?: Date;
    createdAt: Date;
  }): PhaseApprovalResponseDto {
    return {
      id: approval.id,
      phaseId: approval.phaseId,
      approvedBy: approval.approvedBy,
      approverName: approval.approverName,
      requestedBy: approval.requestedBy,
      requesterName: approval.requesterName,
      approvalStatus: approval.approvalStatus,
      comments: approval.comments,
      media: approval.media,
      approvedAt: approval.approvedAt?.toISOString() ?? null,
      requestedAt: approval.requestedAt?.toISOString(),
      createdAt: approval.createdAt.toISOString(),
      updatedAt: approval.createdAt.toISOString(),
    };
  }
}
