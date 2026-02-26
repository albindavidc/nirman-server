import { IsString, IsOptional, IsNotEmpty, IsBoolean } from 'class-validator';

export class VerifyAttendanceRequestDto {
  @IsString()
  @IsNotEmpty()
  attendanceId!: string;

  @IsString()
  @IsNotEmpty()
  supervisorId!: string;

  @IsBoolean()
  @IsNotEmpty()
  isVerified!: boolean;

  @IsString()
  @IsOptional()
  supervisorNotes?: string;
}
