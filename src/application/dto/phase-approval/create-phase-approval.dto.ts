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

  constructor(partial: Partial<MediaItemDto>) {
    this.type = partial.type ?? '';
    this.url = partial.url ?? '';
  }
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

  constructor(partial: Partial<CreatePhaseApprovalDto>) {
    this.approvalStatus = partial.approvalStatus ?? '';
    this.comments = partial.comments;
    this.media = partial.media;
  }
}
