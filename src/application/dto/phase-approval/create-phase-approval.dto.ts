import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MediaItemDto {
  @IsString()
  type!: string;

  @IsString()
  url!: string;
}

export class CreatePhaseApprovalDto {
  @IsString()
  @IsIn(['approved', 'rejected'])
  approvalStatus!: string;

  @IsOptional()
  @IsString()
  comments?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaItemDto)
  media?: MediaItemDto[];
}
