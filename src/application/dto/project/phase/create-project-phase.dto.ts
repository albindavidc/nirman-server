import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

// Note: projectId is set by the controller based on the route parameter; clients
// do not need to supply it, but we keep it optional here for internal use.
export class CreateProjectPhaseDto {
  @IsOptional()
  @IsString()
  projectId?: string;

  @IsString()
  @MinLength(1)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  plannedStartDate?: string;

  @IsOptional()
  @IsDateString()
  plannedEndDate?: string;

  @IsNumber()
  @Type(() => Number)
  sequence!: number;
}
