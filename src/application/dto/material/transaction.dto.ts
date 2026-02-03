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
}
