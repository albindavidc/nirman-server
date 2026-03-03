import { AggregateRoot } from '@nestjs/cqrs';

export class MaterialTransaction extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private _materialId: string,
    private _type: string,
    private _quantity: number,
    private _date: Date,
    private _referenceId: string | null,
    private _performedBy: string | null,
    private _notes: string | null,
  ) {
    super();
  }

  get id(): string {
    return this._id;
  }

  get materialId(): string {
    return this._materialId;
  }

  get type(): string {
    return this._type;
  }

  get quantity(): number {
    return this._quantity;
  }

  get date(): Date {
    return this._date;
  }

  get referenceId(): string | null {
    return this._referenceId;
  }

  get performedBy(): string | null {
    return this._performedBy;
  }

  get notes(): string | null {
    return this._notes;
  }

  updateType(type: string): void {
    this._type = type;
  }

  updateQuantity(quantity: number): void {
    this._quantity = quantity;
  }

  updateDate(date: Date): void {
    this._date = date;
  }

  updateReferenceId(referenceId: string | null): void {
    this._referenceId = referenceId;
  }

  updatePerformedBy(performedBy: string | null): void {
    this._performedBy = performedBy;
  }

  updateNotes(notes: string | null): void {
    this._notes = notes;
  }
}
