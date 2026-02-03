export class MaterialTransaction {
  constructor(
    public id: string,
    public materialId: string,
    public type: string, // IN, OUT, ADJUSTMENT
    public quantity: number,
    public date: Date,
    public referenceId: string | null,
    public performedBy: string | null,
    public notes: string | null, // Mapped to notes? Schema has notes.
    // Schema: id, material_id, type, quantity, date, reference_id, performed_by, notes.
    // No created_at/updated_at in schema for Transaction?
    // Wait, schema has:
    // values: material_id, type, quantity, date, reference_id, performed_by, notes.
    // It does NOT have created_at/updated_at.
    // So I remove them from entity.
  ) {}
}
