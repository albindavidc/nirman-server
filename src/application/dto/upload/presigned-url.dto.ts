import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class GeneratePresignedUrlDto {
  @IsNotEmpty()
  @IsString()
  fileName!: string;

  @IsNotEmpty()
  @IsString()
  fileType!: string;

  @IsOptional()
  @IsString()
  @IsIn(['profile', 'document'])
  uploadType?: 'profile' | 'document';

  constructor(partial: Partial<GeneratePresignedUrlDto>) {
    this.fileName = partial.fileName ?? '';
    this.fileType = partial.fileType ?? '';
    this.uploadType = partial.uploadType;
  }
}

export class PresignedUrlResponseDto {
  uploadUrl!: string;
  viewUrl!: string;
  key!: string;

  constructor(partial: Partial<PresignedUrlResponseDto>) {
    this.uploadUrl = partial.uploadUrl ?? '';
    this.viewUrl = partial.viewUrl ?? '';
    this.key = partial.key ?? '';
  }
}
