import {
  PhaseApproval,
  MediaItem,
} from '../../domain/entities/phase-approval.entity';
import { PhaseApprovalResponseDto } from '../dto/phase-approval/phase-approval-response.dto';
import { PhaseApprovalResult } from '../../domain/repositories/project-phase/phase-approval-repository.interface';
import { ApprovalStatus } from '../../domain/enums/approval-status.enum';

type PrismaPhaseApproval = {
  id: string;
  phaseId: string;
  approvedBy: string | null;
  requestedBy: string;
  approvalStatus: ApprovalStatus;
  comments: string | null;
  media: { type: string; url: string }[];
  approvedAt: Date | null;
  requestedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  approver?: { firstName: string; lastName: string };
  requester?: { firstName: string; lastName: string };
};

export class PhaseApprovalMapper {
  static toDomain(prisma: PrismaPhaseApproval): PhaseApproval {
    return new PhaseApproval(
      prisma.id,
      prisma.phaseId,
      prisma.requestedBy,
      prisma.approvedBy,
      prisma.approvalStatus,
      prisma.comments,
      prisma.media,
      prisma.approvedAt,
      prisma.createdAt,
      prisma.updatedAt,
    );
  }

  static toCreateInput(data: {
    phaseId: string;
    approvedBy?: string;
    requestedBy: string;
    approvalStatus: ApprovalStatus;
    comments: string | null;
    media: MediaItem[];
  }) {
    // Determine approvedAt based on status
    const isDecided =
      data.approvalStatus === ApprovalStatus.APPROVED ||
      data.approvalStatus === ApprovalStatus.REJECTED;

    return {
      phase: { connect: { id: data.phaseId } },
      approver: data.approvedBy
        ? { connect: { id: data.approvedBy } }
        : undefined,
      requester: { connect: { id: data.requestedBy } },
      approvalStatus: data.approvalStatus,
      comments: data.comments,
      media: data.media,
      approvedAt: isDecided ? new Date() : null,
    };
  }

  static toDto(prisma: PrismaPhaseApproval): PhaseApprovalResponseDto {
    return {
      id: prisma.id,
      phaseId: prisma.phaseId,
      approvedBy: prisma.approvedBy,
      approverName: prisma.approver
        ? `${prisma.approver.firstName} ${prisma.approver.lastName}`
        : null,
      requestedBy: prisma.requestedBy,
      requesterName: prisma.requester
        ? `${prisma.requester.firstName} ${prisma.requester.lastName}`
        : 'Unknown',
      approvalStatus: prisma.approvalStatus,
      comments: prisma.comments,
      media: prisma.media,
      approvedAt: prisma.approvedAt?.toISOString() ?? null,
      requestedAt: prisma.requestedAt?.toISOString(),
      createdAt: prisma.createdAt.toISOString(),
      updatedAt: prisma.updatedAt.toISOString(),
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
    approvalStatus: ApprovalStatus;
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
