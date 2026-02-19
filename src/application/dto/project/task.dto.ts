import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  phaseId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

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
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  color?: string;

  constructor(partial: Partial<CreateTaskDto>) {
    this.phaseId = partial.phaseId ?? '';
    this.name = partial.name ?? '';
    this.description = partial.description;
    this.assignedTo = partial.assignedTo;
    this.plannedStartDate = partial.plannedStartDate;
    this.plannedEndDate = partial.plannedEndDate;
    this.priority = partial.priority;
    this.status = partial.status;
    this.notes = partial.notes;
    this.color = partial.color;
  }
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
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  color?: string;

  constructor(partial: Partial<UpdateTaskDto>) {
    this.name = partial.name;
    this.description = partial.description;
    this.assignedTo = partial.assignedTo;
    this.plannedStartDate = partial.plannedStartDate;
    this.plannedEndDate = partial.plannedEndDate;
    this.actualStartDate = partial.actualStartDate;
    this.actualEndDate = partial.actualEndDate;
    this.status = partial.status;
    this.priority = partial.priority;
    this.progress = partial.progress;
    this.notes = partial.notes;
    this.color = partial.color;
  }
}

export class CreateTaskDependencyDto {
  @IsString()
  @IsNotEmpty()
  successorTaskId: string;

  @IsString()
  @IsNotEmpty()
  predecessorTaskId: string;

  @IsString()
  @IsOptional()
  type?: string; // FS, SS, FF, SF

  @IsNumber()
  @IsOptional()
  lagTime?: number;

  constructor(partial: Partial<CreateTaskDependencyDto>) {
    this.successorTaskId = partial.successorTaskId ?? '';
    this.predecessorTaskId = partial.predecessorTaskId ?? '';
    this.type = partial.type;
    this.lagTime = partial.lagTime;
  }
}
