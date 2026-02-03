export class MaterialRequestItemDto {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
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
}
