import { User } from '../../domain/entities/user.entity';
import { ApprovalStatus } from '../../domain/enums/approval-status.enum';

export type ProjectPhaseRecord = {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  progress: number;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  actualStartDate: Date | null;
  actualEndDate: Date | null;
  status: string;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
  workerGroups?: any[];
};

export type RepoUser = {
  firstName: User['firstName'];
  lastName: User['lastName'];
};

export type PhaseWithApprovalsResult = ProjectPhaseRecord & {
  project: {
    id: string;
    name: string;
    budget: number;
    spent: number;
  };
  approvals: Array<{
    id: string;
    phaseId: string;
    approvedBy: string | null;
    approver: RepoUser | null;
    requestedBy: string;
    requester: RepoUser;
    approvalStatus: ApprovalStatus;
    comments: string | null;
    media: unknown;
    approvedAt: Date | null;
    createdAt: Date;
  }>;
  tasks: Array<{ status: string }>;
};
