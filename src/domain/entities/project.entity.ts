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
    // Safely extract properties
    const id = props.id;
    const createdAt = props.createdAt;
    const updatedAt = props.updatedAt;
    const name = props.name;
    const managerIds = props.managerIds;
    const description = props.description;
    const icon = props.icon;
    const status = props.status;
    const progress = props.progress;
    const budget = props.budget;
    const spent = props.spent;
    const startDate = props.startDate;
    const dueDate = props.dueDate;
    const latitude = props.latitude;
    const longitude = props.longitude;
    const workers = props.workers;
    const phases = props.phases;

    this._id = id ?? '';
    this._createdAt = createdAt ?? new Date();
    this._updatedAt = updatedAt ?? new Date();
    this._name = name;
    this._managerIds = managerIds ?? [];
    this._description = description;
    this._icon = icon ?? 'folder';
    this._status = status ?? ProjectStatus.ACTIVE;
    this._progress = progress ?? 0;
    this._budget = budget;
    this._spent = spent;
    this._startDate = startDate;
    this._dueDate = dueDate;
    this._latitude = latitude;
    this._longitude = longitude;
    this._workers = workers ?? [];
    this._phases = phases ?? [];
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
