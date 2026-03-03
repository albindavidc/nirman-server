import { AggregateRoot } from '@nestjs/cqrs';

export class Material extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _projectId: string,
    private _name: string,
    private _code: string,
    private _category: string,
    private _description: string | undefined,
    private _specifications: string | undefined,
    private _currentStock: number,
    private _unit: string,
    private _unitPrice: number | undefined,
    private _reorderLevel: number | undefined,
    private _storageLocation: string | undefined,
    private _preferredSupplierId: string | undefined,
    private _status: string,
    private readonly _createdBy: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  get id(): string {
    return this._id;
  }

  get projectId(): string {
    return this._projectId;
  }

  get name(): string {
    return this._name;
  }

  get code(): string {
    return this._code;
  }

  get category(): string {
    return this._category;
  }

  get description(): string | undefined {
    return this._description;
  }

  get specifications(): string | undefined {
    return this._specifications;
  }

  get currentStock(): number {
    return this._currentStock;
  }

  get unit(): string {
    return this._unit;
  }

  get unitPrice(): number | undefined {
    return this._unitPrice;
  }

  get reorderLevel(): number | undefined {
    return this._reorderLevel;
  }

  get storageLocation(): string | undefined {
    return this._storageLocation;
  }

  get preferredSupplierId(): string | undefined {
    return this._preferredSupplierId;
  }

  get status(): string {
    return this._status;
  }

  get createdBy(): string {
    return this._createdBy;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  updateStock(quantity: number, type: 'IN' | 'OUT' | 'ADJUSTMENT'): void {
    if (type === 'IN') {
      this._currentStock += quantity;
    } else if (type === 'OUT') {
      this._currentStock -= quantity;
    } else {
      this._currentStock += quantity;
    }
    this.updateStatus();
    this._updatedAt = new Date();
  }

  private updateStatus(): void {
    if (this._currentStock <= 0) {
      this._status = 'out_of_stock';
    } else if (this._reorderLevel && this._currentStock <= this._reorderLevel) {
      this._status = 'low_stock';
    } else {
      this._status = 'in_stock';
    }
  }

  updateDetails(
    name: string,
    category: string,
    description?: string,
    specifications?: string,
    unitPrice?: number,
    reorderLevel?: number,
    storageLocation?: string,
    preferredSupplierId?: string,
  ): void {
    this._name = name;
    this._category = category;
    this._description = description;
    this._specifications = specifications;
    this._unitPrice = unitPrice;
    this._reorderLevel = reorderLevel;
    this._storageLocation = storageLocation;
    this._preferredSupplierId = preferredSupplierId;

    this.updateStatus();
    this._updatedAt = new Date();
  }

  // Explicit manual overrides
  changeStatus(status: string): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  changeUnit(unit: string): void {
    this._unit = unit;
    this._updatedAt = new Date();
  }

  markAsArchived(): void {
    this._status = 'archived';
    this._updatedAt = new Date();
  }
}
