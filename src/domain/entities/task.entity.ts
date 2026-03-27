import { AggregateRoot } from '@nestjs/cqrs';

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

export interface TaskProps {
  id?: string;
  phaseId: string;
  assignedTo?: string | null;
  name: string;
  description?: string | null;
  plannedStartDate?: Date | null;
  plannedEndDate?: Date | null;
  actualStartDate?: Date | null;
  actualEndDate?: Date | null;
  status: TaskStatus | string;
  priority: TaskPriority | string;
  progress: number;
  notes?: string | null;
  color?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  assignee?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export class Task extends AggregateRoot {
  private readonly _id: string;
  private _phaseId: string;
  private _assignedTo: string | null;
  private _name: string;
  private _description: string | null;
  private _plannedStartDate: Date | null;
  private _plannedEndDate: Date | null;
  private _actualStartDate: Date | null;
  private _actualEndDate: Date | null;
  private _status: TaskStatus | string;
  private _priority: TaskPriority | string;
  private _progress: number;
  private _notes: string | null;
  private _color: string | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _assignee: { firstName: string; lastName: string; email: string } | null;

  constructor(props: TaskProps) {
    super();
    this._id = props.id ?? '';
    this._phaseId = props.phaseId;
    this._assignedTo = props.assignedTo ?? null;
    this._name = props.name;
    this._description = props.description ?? null;
    this._plannedStartDate = props.plannedStartDate ?? null;
    this._plannedEndDate = props.plannedEndDate ?? null;
    this._actualStartDate = props.actualStartDate ?? null;
    this._actualEndDate = props.actualEndDate ?? null;
    this._status = props.status;
    this._priority = props.priority;
    this._progress = props.progress;
    this._notes = props.notes ?? null;
    this._color = props.color ?? null;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._assignee = props.assignee ?? null;
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get phaseId(): string {
    return this._phaseId;
  }
  get assignedTo(): string | null {
    return this._assignedTo;
  }
  get name(): string {
    return this._name;
  }
  get description(): string | null {
    return this._description;
  }
  get plannedStartDate(): Date | null {
    return this._plannedStartDate;
  }
  get plannedEndDate(): Date | null {
    return this._plannedEndDate;
  }
  get actualStartDate(): Date | null {
    return this._actualStartDate;
  }
  get actualEndDate(): Date | null {
    return this._actualEndDate;
  }
  get status(): TaskStatus | string {
    return this._status;
  }
  get priority(): TaskPriority | string {
    return this._priority;
  }
  get progress(): number {
    return this._progress;
  }
  get notes(): string | null {
    return this._notes;
  }
  get color(): string | null {
    return this._color;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get assignee(): { firstName: string; lastName: string; email: string } | null {
    return this._assignee;
  }

  // Domain methods
  updateDetails(data: {
    name?: string;
    description?: string | null;
    assignedTo?: string | null;
    plannedStartDate?: Date | null;
    plannedEndDate?: Date | null;
    actualStartDate?: Date | null;
    actualEndDate?: Date | null;
    status?: TaskStatus | string;
    priority?: TaskPriority | string;
    progress?: number;
    notes?: string | null;
    color?: string | null;
  }): void {
    if (data.name !== undefined) this._name = data.name;
    if (data.description !== undefined) this._description = data.description;
    if (data.assignedTo !== undefined) this._assignedTo = data.assignedTo;
    if (data.plannedStartDate !== undefined) this._plannedStartDate = data.plannedStartDate;
    if (data.plannedEndDate !== undefined) this._plannedEndDate = data.plannedEndDate;
    if (data.actualStartDate !== undefined) this._actualStartDate = data.actualStartDate;
    if (data.actualEndDate !== undefined) this._actualEndDate = data.actualEndDate;
    if (data.status !== undefined) this._status = data.status;
    if (data.priority !== undefined) this._priority = data.priority;
    if (data.progress !== undefined) this._progress = data.progress;
    if (data.notes !== undefined) this._notes = data.notes;
    if (data.color !== undefined) this._color = data.color;
    this._updatedAt = new Date();
  }

  markInProgress(): void {
    this._status = TaskStatus.IN_PROGRESS;
    this._actualStartDate = new Date();
    this._updatedAt = new Date();
  }

  markDone(): void {
    this._status = TaskStatus.DONE;
    this._progress = 100;
    this._actualEndDate = new Date();
    this._updatedAt = new Date();
  }

  softDelete(): void {
    this._status = TaskStatus.DELETED;
    this._updatedAt = new Date();
  }
}

// Alias for backward compatibility across the application
export type TaskEntity = Task;

// ─── Task Dependency ──────────────────────────────────────────────────────────

export interface TaskDependencyProps {
  id?: string;
  phaseId: string;
  successorTaskId: string;
  predecessorTaskId: string;
  type: string;
  lagTime: number;
  notes?: string | null;
}

export class TaskDependency {
  private readonly _id: string;
  private _phaseId: string;
  private _successorTaskId: string;
  private _predecessorTaskId: string;
  private _type: string;
  private _lagTime: number;
  private _notes: string | null;

  constructor(props: TaskDependencyProps) {
    this._id = props.id ?? '';
    this._phaseId = props.phaseId;
    this._successorTaskId = props.successorTaskId;
    this._predecessorTaskId = props.predecessorTaskId;
    this._type = props.type;
    this._lagTime = props.lagTime;
    this._notes = props.notes ?? null;
  }

  // Getters
  get id(): string {
    return this._id;
  }
  get phaseId(): string {
    return this._phaseId;
  }
  get successorTaskId(): string {
    return this._successorTaskId;
  }
  get predecessorTaskId(): string {
    return this._predecessorTaskId;
  }
  get type(): string {
    return this._type;
  }
  get lagTime(): number {
    return this._lagTime;
  }
  get notes(): string | null {
    return this._notes;
  }
}

// Alias for backward compatibility across the application
export type TaskDependencyEntity = TaskDependency;
