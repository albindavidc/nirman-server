export class MaterialTransaction {
  constructor(
    public id: string,
    public materialId: string,
    public type: string,
    public quantity: number,
    public date: Date,
    public referenceId: string | null,
    public performedBy: string | null,
    public notes: string | null,
  ) {}
}
