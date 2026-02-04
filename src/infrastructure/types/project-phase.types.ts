import { User } from '../../domain/entities/user.entity';

export type ProjectPhaseRecord = {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  progress: number;
  planned_start_date: Date | null;
  planned_end_date: Date | null;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  status: string;
  sequence: number;
  created_at: Date;
  updated_at: Date;
};

export type RepoUser = {
  first_name: User['firstName'];
  last_name: User['lastName'];
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
    phase_id: string;
    approved_by: string | null;
    approver: RepoUser | null;
    requested_by: string;
    requester: RepoUser;
    approval_status: string;
    comments: string | null;
    media: unknown;
    approved_at: Date | null;
    created_at: Date;
  }>;
  tasks: Array<{ status: string }>;
};
