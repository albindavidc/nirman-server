import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckOutDto {
  @IsString()
  @IsNotEmpty()
  attendanceId: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
