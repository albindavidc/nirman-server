import { ProjectPhase } from '../entities/project-phase.entity';

/**
 * Project Phase Repository Interface
 *
 * Defines the contract for project phase persistence operations.
 */

export interface UpdateProjectPhaseData {
  name?: string;
  description?: string;
  progress?: number;
  status?: string;
  sequence?: number;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
}

export interface PhaseWithApprovals {
  phase: ProjectPhase;
  project: {
    id: string;
    name: string;
    budget: number | null;
    spent: number | null;
  };
  approvals: Array<{
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
    createdAt: Date;
  }>;
  taskStats: {
    total: number;
    completed: number;
  };
}

export interface IProjectPhaseRepository {
  /**
   * Find a phase by ID
   */
  findById(id: string): Promise<ProjectPhase | null>;

  /**
   * Find all phases for a project
   */
  findByProjectId(projectId: string): Promise<ProjectPhase[]>;

  /**
   * Find phase with project and approval details (for approval workflow)
   */
  findWithApprovals(phaseId: string): Promise<PhaseWithApprovals | null>;

  /**
   * Create a new phase
   */
  create(phase: ProjectPhase): Promise<ProjectPhase>;

  /**
   * Update a phase
   */
  update(id: string, data: UpdateProjectPhaseData): Promise<ProjectPhase>;

  /**
   * Update phase status only
   */
  updateStatus(id: string, status: string): Promise<void>;
}

/**
 * Injection token for the Project Phase repository
 */
export const PROJECT_PHASE_REPOSITORY = Symbol('PROJECT_PHASE_REPOSITORY');
