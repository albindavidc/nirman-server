export interface MediaItem {
  type: string;
  url: string;
}

export class PhaseApproval {
  constructor(
    public id: string,
    public phaseId: string,
    public approvedBy: string | null,
    public approvalStatus: string,
    public comments: string | null,
    public media: MediaItem[],
    public approvedAt: Date | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
