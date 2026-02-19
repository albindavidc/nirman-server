import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  constructor(partial: Partial<CheckInDto>) {
    this.userId = partial.userId ?? '';
    this.projectId = partial.projectId ?? '';
    this.location = partial.location;
    this.latitude = partial.latitude;
    this.longitude = partial.longitude;
  }
}
