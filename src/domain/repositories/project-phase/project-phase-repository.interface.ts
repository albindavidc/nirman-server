import { ProjectPhase } from '../../entities/project-phase.entity';
import { ApprovalStatus } from '../../enums/approval-status.enum';

import { IProjectPhaseReader } from './project-phase.reader.interface';
import { IProjectPhaseWriter } from './project-phase.writer.interface';
import { IProjectPhaseQueryReader } from './project-phase.query-reader.interface';

/**
 * Project Phase Repository Interface
 */

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
    approvalStatus: ApprovalStatus;
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

export const PROJECT_PHASE_REPOSITORY = Symbol('PROJECT_PHASE_REPOSITORY');
export const PROJECT_PHASE_READER = Symbol('PROJECT_PHASE_READER');
export const PROJECT_PHASE_WRITER = Symbol('PROJECT_PHASE_WRITER');
export const PROJECT_PHASE_QUERY_READER = Symbol('PROJECT_PHASE_QUERY_READER');

export interface IProjectPhaseRepository
  extends IProjectPhaseReader, IProjectPhaseWriter, IProjectPhaseQueryReader {}
