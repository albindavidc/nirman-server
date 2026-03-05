import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTaskDto {
  // phaseId is required when creating a task; the client/UI should always supply it
  @IsString()
  @IsNotEmpty()
  phaseId!: string;

  // task name is also mandatory
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsDateString()
  @IsOptional()
  plannedStartDate?: string;

  @IsDateString()
  @IsOptional()
  plannedEndDate?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsDateString()
  @IsOptional()
  plannedStartDate?: string;

  @IsDateString()
  @IsOptional()
  plannedEndDate?: string;

  @IsDateString()
  @IsOptional()
  actualStartDate?: string;

  @IsDateString()
  @IsOptional()
  actualEndDate?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  priority?: string;

  @IsNumber()
  @IsOptional()
  progress?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  color?: string;
}

export class CreateTaskDependencyDto {
  @IsString()
  @IsNotEmpty()
  successorTaskId!: string;

  @IsString()
  @IsNotEmpty()
  predecessorTaskId!: string;

  @IsString()
  @IsOptional()
  type?: string; // FS, SS, FF, SF

  @IsNumber()
  @IsOptional()
  lagTime?: number;
}

export class TaskDto {
  id!: string;
  phaseId!: string;
  name!: string;
  description?: string;
  assignedTo?: string;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  status!: string;
  priority!: string;
  progress!: number;
  notes?: string;
  color?: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export class TaskDependencyDto {
  id!: string;
  successorTaskId!: string;
  predecessorTaskId!: string;
  type!: string;
  lagTime!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
