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
}

export class PresignedUrlResponseDto {
  uploadUrl!: string;
  viewUrl!: string;
  key!: string;
}
