export class MaterialRequest {
  constructor(
    public id: string,
    public requestNumber: string,
    public projectId: string,
    public requestedBy: string,
    public items: MaterialRequestItem[],
    public priority: string, // low, medium, high, urgent
    public purpose: string | null,
    public deliveryLocation: string | null,
    public requiredDate: Date,
    public status: string, // pending, approved, rejected, partially_fulfilled, fulfilled, cancelled
    public approvedBy: string | null,
    public approvedAt: Date | null,
    public approvalComments: string | null,
    public rejectionReason: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}

export class MaterialRequestItem {
  constructor(
    public materialId: string,
    public materialName: string, // Schema stores JSON, might include name for snapshot
    public quantity: number,
    public unit: string,
  ) {}
}
