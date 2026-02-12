/**
 * Phase Approval Repository Interface
 */

export interface PhaseApprovalMedia {
  type: string;
  url: string;
}

export interface CreatePhaseApprovalData {
  phaseId: string;
  approvedBy?: string;
  requestedBy: string;
  approvalStatus: string;
  comments: string | null;
  media: PhaseApprovalMedia[];
}

export interface PhaseApprovalResult {
  id: string;
  phaseId: string;
  phaseName?: string;
  approvedBy: string | null;
  approverFirstName: string | null;
  approverLastName: string | null;
  requestedBy: string;
  requesterFirstName: string;
  requesterLastName: string;
  approvalStatus: string;
  comments: string | null;
  media: PhaseApprovalMedia[];
  approvedAt: Date | null;
  requestedAt: Date;
  createdAt: Date;
}

export interface IPhaseApprovalRepository {
  /**
   * Find all approvals for a phase
   */
  findByPhaseId(phaseId: string): Promise<PhaseApprovalResult[]>;

  /**
   * Find all approvals for a project
   */
  findByProjectId(projectId: string): Promise<PhaseApprovalResult[]>;

  /**
   * Find the latest approval for a phase
   */
  findLatestByPhaseId(phaseId: string): Promise<PhaseApprovalResult | null>;

  /**
   * Create a new phase approval
   */
  create(data: CreatePhaseApprovalData): Promise<PhaseApprovalResult>;
}

/**
 * Injection token for the Phase Approval repository
 */
export const PHASE_APPROVAL_REPOSITORY = Symbol('PHASE_APPROVAL_REPOSITORY');
