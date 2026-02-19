import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsDateString,
  Min,
  Max,
  MinLength,
} from 'class-validator';
import { ProjectStatus } from '../../../domain/enums/project-status.enum';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  spent?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  managerIds?: string[];

  constructor(partial: Partial<UpdateProjectDto>) {
    this.name = partial.name;
    this.description = partial.description;
    this.icon = partial.icon;
    this.status = partial.status;
    this.progress = partial.progress;
    this.budget = partial.budget;
    this.spent = partial.spent;
    this.startDate = partial.startDate;
    this.dueDate = partial.dueDate;
    this.managerIds = partial.managerIds;
  }
}
