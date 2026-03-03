import { AggregateRoot } from '@nestjs/cqrs';
import { ProjectStatus } from '../enums/project-status.enum';
import { ProjectPhase } from './project-phase.entity';
import { ProjectWorker } from '../types';

export class Project extends AggregateRoot {
  private readonly _id: string;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private _name: string;
  private _managerIds: string[];
  private _description?: string;
  private _icon: string;
  private _status: ProjectStatus;
  private _progress: number;
  private _budget?: number;
  private _spent?: number;
  private _startDate?: Date;
  private _dueDate?: Date;
  private _latitude?: number;
  private _longitude?: number;
  private _workers: ProjectWorker[];
  private _phases: ProjectPhase[];

  constructor(
    props: Partial<Project> & {
      name: string;
    },
  ) {
    super();
    // Safely extract properties handling both mapped DTOs and raw persistence data
    const {
      id,
      createdAt,
      updatedAt,
      name,
      managerIds,
      description,
      icon,
      status,
      progress,
      budget,
      spent,
      startDate,
      dueDate,
      latitude,
      longitude,
      workers,
      phases,
    } = props as unknown as {
      [key: string]:
        | string
        | string[]
        | number
        | Date
        | ProjectStatus
        | ProjectWorker[]
        | ProjectPhase[]
        | undefined;
    };

    this._id = (id as string) ?? '';
    this._createdAt = (createdAt as Date) ?? new Date();
    this._updatedAt = (updatedAt as Date) ?? new Date();
    this._name = name as string;
    this._managerIds = (managerIds as string[]) ?? [];
    this._description = description as string | undefined;
    this._icon = (icon as string) ?? 'folder';
    this._status = (status as ProjectStatus) ?? ProjectStatus.ACTIVE;
    this._progress = (progress as number) ?? 0;
    this._budget = budget as number | undefined;
    this._spent = spent as number | undefined;
    this._startDate = startDate as Date | undefined;
    this._dueDate = dueDate as Date | undefined;
    this._latitude = latitude as number | undefined;
    this._longitude = longitude as number | undefined;
    this._workers = (workers as ProjectWorker[]) ?? [];
    this._phases = (phases as ProjectPhase[]) ?? [];
  }

  get id(): string {
    return this._id;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
  get name(): string {
    return this._name;
  }
  get managerIds(): string[] {
    return this._managerIds;
  }
  get description(): string | undefined {
    return this._description;
  }
  get icon(): string {
    return this._icon;
  }
  get status(): ProjectStatus {
    return this._status;
  }
  get progress(): number {
    return this._progress;
  }
  get budget(): number | undefined {
    return this._budget;
  }
  get spent(): number | undefined {
    return this._spent;
  }
  get startDate(): Date | undefined {
    return this._startDate;
  }
  get dueDate(): Date | undefined {
    return this._dueDate;
  }
  get latitude(): number | undefined {
    return this._latitude;
  }
  get longitude(): number | undefined {
    return this._longitude;
  }
  get workers(): ProjectWorker[] {
    return this._workers;
  }
  get phases(): ProjectPhase[] {
    return this._phases;
  }

  updateDetails(
    name: string,
    description?: string,
    icon?: string,
    startDate?: Date,
    dueDate?: Date,
  ): void {
    this._name = name;
    this._description = description;
    if (icon) this._icon = icon;
    this._startDate = startDate;
    this._dueDate = dueDate;
    this._updatedAt = new Date();
  }

  updateFinancials(budget?: number, spent?: number): void {
    if (budget !== undefined) this._budget = budget;
    if (spent !== undefined) this._spent = spent;
    this._updatedAt = new Date();
  }

  updateLocation(latitude?: number, longitude?: number): void {
    this._latitude = latitude;
    this._longitude = longitude;
    this._updatedAt = new Date();
  }

  updateStatus(status: ProjectStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  updateProgress(progress: number): void {
    this._progress = progress;
    this._updatedAt = new Date();
  }

  addManager(managerId: string): void {
    if (!this._managerIds.includes(managerId)) {
      this._managerIds.push(managerId);
      this._updatedAt = new Date();
    }
  }

  removeManager(managerId: string): void {
    this._managerIds = this._managerIds.filter((id) => id !== managerId);
    this._updatedAt = new Date();
  }
}
