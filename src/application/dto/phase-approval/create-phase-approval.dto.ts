import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MediaItemDto {
  @IsString()
  type!: string;

  @IsString()
  url!: string;
}

export class CreatePhaseApprovalDto {
  @IsString()
  approvalStatus!: string; // 'approved' | 'rejected'

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media?: MediaItemDto[];
}
