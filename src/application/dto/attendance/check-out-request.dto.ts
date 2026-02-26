import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CheckOutRequestDto {
  @IsString()
  @IsNotEmpty()
  attendanceId!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  supervisorNotes?: string;
}
