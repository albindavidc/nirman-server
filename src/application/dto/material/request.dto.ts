export class MaterialRequestItemDto {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;

  constructor(partial: Partial<MaterialRequestItemDto>) {
    this.materialId = partial.materialId ?? '';
    this.materialName = partial.materialName ?? '';
    this.quantity = partial.quantity ?? 0;
    this.unit = partial.unit ?? '';
  }
}

export class MaterialRequestDto {
  id: string;
  requestNumber: string;
  projectId: string;
  requestedBy: string;
  items: MaterialRequestItemDto[];
  priority: string;
  purpose?: string;
  deliveryLocation?: string;
  requiredDate: Date;
  status: string;
  approvedBy?: string;
  approvedAt?: Date;
  approvalComments?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<MaterialRequestDto>) {
    this.id = partial.id ?? '';
    this.requestNumber = partial.requestNumber ?? '';
    this.projectId = partial.projectId ?? '';
    this.requestedBy = partial.requestedBy ?? '';
    this.items = partial.items ?? [];
    this.priority = partial.priority ?? '';
    this.purpose = partial.purpose;
    this.deliveryLocation = partial.deliveryLocation;
    this.requiredDate = partial.requiredDate ?? new Date();
    this.status = partial.status ?? '';
    this.approvedBy = partial.approvedBy;
    this.approvedAt = partial.approvedAt;
    this.approvalComments = partial.approvalComments;
    this.rejectionReason = partial.rejectionReason;
    this.createdAt = partial.createdAt ?? new Date();
    this.updatedAt = partial.updatedAt ?? new Date();
  }
}

export class CreateMaterialRequestDto {
  projectId: string;
  items: {
    materialId: string;
    materialName: string;
    quantity: number;
    unit: string;
  }[];
  priority?: string;
  purpose?: string;
  deliveryLocation?: string;
  requiredDate: Date;

  constructor(partial: Partial<CreateMaterialRequestDto>) {
    this.projectId = partial.projectId ?? '';
    this.items = partial.items ?? [];
    this.priority = partial.priority;
    this.purpose = partial.purpose;
    this.deliveryLocation = partial.deliveryLocation;
    this.requiredDate = partial.requiredDate ?? new Date();
  }
}
