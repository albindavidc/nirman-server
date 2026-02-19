import {
  IsString,
  IsOptional,
  IsNotEmpty,
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

  constructor(partial: Partial<CheckInDto>) {
    this.projectId = partial.projectId ?? '';
    this.userId = partial.userId ?? '';
    this.location = partial.location;
    this.method = partial.method;
  }
}

export class CheckOutDto {
  @IsString()
  @IsNotEmpty()
  attendanceId: string;

  @IsDateString()
  @IsOptional()
  checkOutTime?: Date;

  constructor(partial: Partial<CheckOutDto>) {
    this.attendanceId = partial.attendanceId ?? '';
    this.checkOutTime = partial.checkOutTime;
  }
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

  constructor(partial: Partial<VerifyAttendanceDto>) {
    this.attendanceId = partial.attendanceId ?? '';
    this.supervisorId = partial.supervisorId ?? '';
    this.isVerified = partial.isVerified ?? false;
    this.supervisorNotes = partial.supervisorNotes;
  }
}
