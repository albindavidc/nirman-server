import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export enum AttendanceMethodDto {
  QR_CODE = 'QR_CODE',
  MANUAL = 'MANUAL',
}

export class CheckInRequestDto {
  @IsString()
  @IsNotEmpty()
  projectId!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsOptional()
  @IsEnum(AttendanceMethodDto)
  method?: AttendanceMethodDto;

  @IsOptional()
  @IsString()
  supervisorNotes?: string;
}
