import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CheckInDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  method?: string;
}

export class CheckOutDto {
  @IsString()
  @IsNotEmpty()
  attendanceId: string;

  @IsDateString()
  @IsOptional()
  checkOutTime?: Date;
}

export class VerifyAttendanceDto {
  @IsString()
  @IsNotEmpty()
  attendanceId: string;

  @IsString()
  @IsNotEmpty()
  supervisorId: string;

  @IsBoolean()
  @IsNotEmpty()
  isVerified: boolean;

  @IsString()
  @IsOptional()
  supervisorNotes?: string;
}
