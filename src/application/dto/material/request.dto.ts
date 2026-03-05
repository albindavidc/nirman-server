import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { MaterialRequestPriority } from '../../../domain/enums/material-request-priority.enum';

export class MaterialRequestItemDto {
  materialId!: string;
  materialName!: string;
  quantity!: number;
  unit!: string;
}

export class MaterialRequestDto {
  id!: string;
  requestNumber!: string;
  projectId!: string;
  requestedBy!: string;
  items!: MaterialRequestItemDto[];
  priority!: string;
  purpose?: string;
  deliveryLocation?: string;
  requiredDate?: Date;
  status!: string;
  approvedBy?: string;
  approvedAt?: Date;
  approvalComments?: string;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MaterialItemDto {
  @IsUUID('4')
  @IsNotEmpty()
  materialId!: string;

  @IsString()
  @IsNotEmpty()
  materialName!: string;

  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  @Type(() => Number)
  quantity!: number;

  @IsString()
  @IsNotEmpty()
  unit!: string;
}

export class CreateMaterialRequestDto {
  @IsUUID('4')
  @IsNotEmpty()
  projectId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique((item: MaterialItemDto) => item.materialId)
  @ValidateNested({ each: true })
  @Type(() => MaterialItemDto)
  items!: MaterialItemDto[];

  @IsIn(Object.values(MaterialRequestPriority))
  @IsNotEmpty()
  priority!: MaterialRequestPriority;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  purpose?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deliveryLocation?: string;

  @IsDateString()
  @IsNotEmpty()
  requiredDate!: Date;
}
