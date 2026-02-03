export class CreatePhaseApprovalCommand {
  constructor(
    public readonly phaseId: string,
    public readonly approvedBy: string,
    public readonly requestedBy: string,
    public readonly approvalStatus: string,
    public readonly comments: string | null,
    public readonly media: { type: string; url: string }[],
  ) {}
}
