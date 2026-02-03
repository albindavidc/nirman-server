export class Material {
  constructor(
    public id: string,
    public projectId: string,
    public name: string,
    public code: string,
    public category: string,
    public description: string | undefined,
    public specifications: string | undefined,
    public currentStock: number,
    public unit: string,
    public unitPrice: number | undefined,
    public reorderLevel: number | undefined,
    public storageLocation: string | undefined,
    public preferredSupplierId: string | undefined,
    public status: string,
    public createdBy: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  updateStock(quantity: number, type: 'IN' | 'OUT' | 'ADJUSTMENT'): void {
    if (type === 'IN') {
      this.currentStock += quantity;
    } else if (type === 'OUT') {
      this.currentStock -= quantity;
    } else {
      this.currentStock = quantity; // Adjustment sets the stock directly or adds? Usually adjustment is delta. Let's assume delta for simplicity, or absolute?
      // If adjustment is delta:
      this.currentStock += quantity;
    }
    this.updateStatus();
  }

  private updateStatus(): void {
    if (this.currentStock <= 0) {
      this.status = 'out_of_stock';
    } else if (this.reorderLevel && this.currentStock <= this.reorderLevel) {
      this.status = 'low_stock';
    } else {
      this.status = 'in_stock';
    }
  }
}
