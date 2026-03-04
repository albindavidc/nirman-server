import { ApprovalStatus } from '../../../domain/enums/approval-status.enum';

export class CreatePhaseApprovalCommand {
  constructor(
    public readonly phaseId: string,
    public readonly approvedBy: string,
    public readonly requestedBy: string,
    public readonly approvalStatus: ApprovalStatus,
    public readonly comments: string | null,
    public readonly media: { type: string; url: string }[],
  ) {}
}
