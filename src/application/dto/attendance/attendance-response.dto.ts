import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationMetaDto } from '../pagination-meta.dto';

export class AttendanceResponseDto {
  @IsString()
  id!: string;

  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsDate()
  @Type(() => Date)
  date!: Date;

  @IsDate()
  @Type(() => Date)
  checkIn!: Date | null;

  @IsDate()
  @Type(() => Date)
  checkOut?: Date | null;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  location?: string | null;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  workHours!: number | null;

  @IsString()
  method!: string | null;

  @IsOptional()
  @IsString()
  supervisorNotes?: string | null;

  @IsBoolean()
  @IsNotEmpty()
  isVerified!: boolean;

  @IsOptional()
  @IsString()
  verifiedBy?: string | null;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  verifiedAt?: Date | null;
}

export class PaginatedAttendanceDto {
  @Type(() => AttendanceResponseDto)
  data!: AttendanceResponseDto[];

  @Type(() => PaginationMetaDto)
  meta!: PaginationMetaDto;
}

// export class AttendanceStatsDto {
//   hoursThisWeek!: number;
//   hoursThisMonth!: number;
//   attendanceRate!: number;
//   lateArrivals!: number;
// }

// export class ProjectAttendanceStatsDto {
//   attendanceRate!: number;
//   presentToday!: number;
//   lateArrivals!: number;
//   absent!: number;
// }
