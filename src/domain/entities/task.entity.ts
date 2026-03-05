export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  DELETED = 'DELETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface TaskEntity {
  id: string;
  phaseId: string;
  assignedTo: string | null;
  name: string;
  description: string | null;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  actualStartDate: Date | null;
  actualEndDate: Date | null;
  status: TaskStatus | string;
  priority: TaskPriority | string;
  progress: number;
  notes?: string | null;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignee?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface TaskDependencyEntity {
  id: string;
  phaseId: string;
  successorTaskId: string;
  predecessorTaskId: string;
  type: string;
  lagTime: number;
  notes: string | null;
}
