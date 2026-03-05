import { PhaseApprovalMedia } from '../../domain/repositories/project-phase/phase-approval-repository.interface';
import { ApprovalStatus } from '../../domain/enums/approval-status.enum';

export type RepoUser = {
  first_name: string;
  last_name: string;
};

/**
 * Typed projection of a PhaseApproval Prisma record with joined user relations.
 * Used internally in infrastructure only — never crosses into domain or application layers.
 */
export interface PhaseApprovalWithUsers {
  id: string;
  phase_id: string;
  approved_by: string | null;
  approver: RepoUser | null;
  requested_by: string;
  requester: RepoUser;
  approval_status: ApprovalStatus;
  comments: string | null;
  media: PhaseApprovalMedia[];
  approved_at: Date | null;
  requested_at: Date;
  created_at: Date;
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
