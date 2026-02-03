export class RequestPhaseApprovalCommand {
  constructor(
    public readonly phaseId: string,
    public readonly requestedBy: string,
    public readonly comments: string | null,
    public readonly media: { type: string; url: string }[],
    public readonly approverId?: string,
  ) {}
}
