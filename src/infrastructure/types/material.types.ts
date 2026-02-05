export interface MaterialPersistence {
  id: string;
  project_id: string;
  material_name: string;
  material_code: string;
  category: string;
  description: string | null;
  specifications: string | null;
  current_stock: number;
  unit: string;
  unit_price: number | null;
  reorder_level: number | null;
  storage_location: string | null;
  preferred_supplier_id: string | null;
  status: string;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export type MaterialCreatePersistenceInput = Omit<
  MaterialPersistence,
  'id' | 'created_at' | 'updated_at'
>;

export type MaterialUpdatePersistenceInput = Partial<
  Omit<
    MaterialPersistence,
    'id' | 'created_at' | 'updated_at' | 'project_id' | 'material_code'
  >
>;

export interface MaterialWherePersistenceInput {
  project_id?: string;
  id?: string;
}
