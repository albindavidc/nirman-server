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
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

import { ProjectStatus } from '../../../domain/enums/project-status.enum';

export class ProjectMemberDto {
  @IsString()
  userId: string;

  @IsString()
  @IsIn(['Admin', 'Viewer'])
  role: 'Admin' | 'Viewer';

  @IsOptional()
  @IsDateString()
  joinedAt?: string;

  constructor(partial: Partial<ProjectMemberDto>) {
    this.userId = partial.userId ?? '';
    this.role = partial.role ?? 'Viewer';
    this.joinedAt = partial.joinedAt;
  }
}

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  managerIds?: string[];

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
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberDto)
  members?: ProjectMemberDto[];

  constructor(partial: Partial<CreateProjectDto>) {
    this.name = partial.name ?? '';
    this.managerIds = partial.managerIds;
    this.description = partial.description;
    this.icon = partial.icon;
    this.status = partial.status;
    this.progress = partial.progress;
    this.budget = partial.budget;
    this.spent = partial.spent;
    this.startDate = partial.startDate;
    this.dueDate = partial.dueDate;
    this.latitude = partial.latitude;
    this.longitude = partial.longitude;
    this.members = partial.members;
  }
}
