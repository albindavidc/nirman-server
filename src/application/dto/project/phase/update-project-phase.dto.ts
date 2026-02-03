import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';

export const PHASE_STATUSES = [
  'Not Started',
  'In Progress',
  'Completed',
  'On Hold',
] as const;
export type PhaseStatus = (typeof PHASE_STATUSES)[number];

export class UpdateProjectPhaseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsString()
  @IsIn(PHASE_STATUSES)
  status?: PhaseStatus;

  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @IsOptional()
  @IsDateString()
  actualStartDate?: string;

  @IsOptional()
  @IsDateString()
  actualEndDate?: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;
}
