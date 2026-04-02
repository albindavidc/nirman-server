export interface MaterialPersistence {
  id: string;
  projectId: string;
  materialName: string;
  materialCode: string;
  category: string;
  description: string | null;
  specifications: string | null;
  currentStock: number;
  unit: string;
  unitPrice: number | null;
  reorderLevel: number | null;
  storageLocation: string | null;
  preferredSupplierId: string | null;
  status: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type MaterialCreatePersistenceInput = Omit<
  MaterialPersistence,
  'id' | 'createdAt' | 'updatedAt'
>;

export type MaterialUpdatePersistenceInput = Partial<
  Omit<
    MaterialPersistence,
    'id' | 'createdAt' | 'updatedAt' | 'projectId' | 'materialCode'
  >
>;

export interface MaterialWherePersistenceInput {
  projectId?: string;
  id?: string;
}
