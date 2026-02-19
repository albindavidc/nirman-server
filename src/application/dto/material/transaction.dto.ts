import { IsNumber, IsString, IsOptional, IsIn, Min } from 'class-validator';

export class MaterialTransactionDto {
  id: string;
  materialId: string;
  type: string;
  quantity: number;
  date: Date;
  referenceId?: string;
  performedBy?: string;
  notes?: string;

  constructor(partial: Partial<MaterialTransactionDto>) {
    this.id = partial.id ?? '';
    this.materialId = partial.materialId ?? '';
    this.type = partial.type ?? '';
    this.quantity = partial.quantity ?? 0;
    this.date = partial.date ?? new Date();
    this.referenceId = partial.referenceId;
    this.performedBy = partial.performedBy;
    this.notes = partial.notes;
  }
}

export class CreateMaterialTransactionDto {
  @IsIn(['IN', 'OUT', 'ADJUSTMENT'])
  type: 'IN' | 'OUT' | 'ADJUSTMENT';

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;

  constructor(partial: Partial<CreateMaterialTransactionDto>) {
    this.type = partial.type ?? 'IN';
    this.quantity = partial.quantity ?? 0;
    this.referenceId = partial.referenceId;
    this.notes = partial.notes;
    this.unitPrice = partial.unitPrice;
  }
}
