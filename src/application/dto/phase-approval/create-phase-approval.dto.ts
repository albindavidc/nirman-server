import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApprovalStatus } from '../../../domain/enums/approval-status.enum';

class MediaItemDto {
  @IsString()
  type!: string;

  @IsString()
  url!: string;
}

export class CreatePhaseApprovalDto {
  @IsEnum(ApprovalStatus)
  approvalStatus!: ApprovalStatus;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media?: MediaItemDto[];
}
