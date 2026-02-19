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

  constructor(partial: Partial<CheckOutDto>) {
    this.attendanceId = partial.attendanceId ?? '';
    this.location = partial.location;
    this.notes = partial.notes;
  }
}
