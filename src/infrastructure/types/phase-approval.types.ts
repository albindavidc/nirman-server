import { PhaseApprovalMedia } from '../../domain/repositories/project-phase/phase-approval-repository.interface';
import { ApprovalStatus } from '../../domain/enums/approval-status.enum';

export type RepoUser = {
  firstName: string;
  lastName: string;
};

/**
 * Typed projection of a PhaseApproval Prisma record with joined user relations.
 * Used internally in infrastructure only — never crosses into domain or application layers.
 */
export interface PhaseApprovalWithUsers {
  id: string;
  phaseId: string;
  approvedBy: string | null;
  approver: RepoUser | null;
  requestedBy: string;
  requester: RepoUser;
  approvalStatus: ApprovalStatus;
  comments: string | null;
  media: PhaseApprovalMedia[];
  approvedAt: Date | null;
  requestedAt: Date;
  createdAt: Date;
  phase?: {
    name: string;
  };
}

/**
 * Extended projection that includes phase + project data (used by findByProjectId / findAll).
 */
export interface PhaseApprovalWithPhaseAndProject extends PhaseApprovalWithUsers {
  phase: {
    name: string;
    project: {
      id: string;
      name: string;
    };
  };
}
