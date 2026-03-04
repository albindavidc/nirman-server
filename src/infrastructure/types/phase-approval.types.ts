import { User } from '../../domain/entities/user.entity';
import { ApprovalStatus } from '../../domain/enums/approval-status.enum';

export type RepoUser = {
  first_name: User['firstName'];
  last_name: User['lastName'];
};

export interface PhaseApprovalWithUsers {
  id: string;
  phase_id: string;
  approved_by: string | null;
  approver: RepoUser | null;
  requested_by: string;
  requester: RepoUser;
  approval_status: ApprovalStatus;
  comments: string | null;
  media: unknown;
  approved_at: Date | null;
  requested_at: Date;
  created_at: Date;
  phase?: {
    name: string;
  };
}
