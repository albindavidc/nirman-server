export interface MaterialDto {
  id: string;
  projectId: string;
  name: string;
  code: string;
  category: string;
  description?: string;
  specifications?: string;
  currentStock: number;
  unit: string;
  unitPrice?: number;
  reorderLevel?: number;
  storageLocation?: string;
  preferredSupplierId?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  // Aggregated transaction data
  totalReceived?: number;
  totalUsed?: number;
}

export interface CreateMaterialDto {
  name: string;
  code: string;
  category: string;
  description?: string;
  specifications?: string;
  unit: string;
  unitPrice?: number;
  reorderLevel?: number;
  storageLocation?: string;
  preferredSupplierId?: string;
}

export interface UpdateMaterialStockDto {
  quantity: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  referenceId?: string;
  notes?: string;
}

export interface MaterialStatsDto {
  totalItems: number;
  totalValue: number;
  sufficientStock: number;
  lowStock: number;
  criticalStock: number;
  pendingDeliveries: number;
}
