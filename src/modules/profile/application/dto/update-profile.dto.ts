import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  // Basic phone validation or just string
  phoneNumber?: string;

  @IsOptional()
  @IsUrl()
  profilePhotoUrl?: string;
}
