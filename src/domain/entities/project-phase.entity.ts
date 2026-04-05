import { AggregateRoot } from '@nestjs/cqrs';

export class ProjectPhase extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _projectId: string,
    private _name: string,
    private _description: string | null,
    private _progress: number,
    private _plannedStartDate: Date | null,
    private _plannedEndDate: Date | null,
    private _actualStartDate: Date | null,
    private _actualEndDate: Date | null,
    private _status: string,
    private _sequence: number,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _workerGroups: any[] = [],
    private _workerGroupIds: string[] = [],
  ) {
    super();
  }

  get id(): string {
    return this._id;
  }

  get projectId(): string {
    return this._projectId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get progress(): number {
    return this._progress;
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

  get status(): string {
    return this._status;
  }

  get sequence(): number {
    return this._sequence;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
  
  get workerGroups(): any[] {
    return this._workerGroups;
  }

  get workerGroupIds(): string[] {
    return this._workerGroupIds;
  }

  updateDetails(
    name: string,
    description: string | null,
    sequence: number,
  ): void {
    this._name = name;
    this._description = description;
    this._sequence = sequence;
    this._updatedAt = new Date();
  }

  updateProgress(progress: number): void {
    this._progress = progress;
    this._updatedAt = new Date();
  }

  updateStatus(status: string): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  updatePlannedDates(startDate: Date | null, endDate: Date | null): void {
    this._plannedStartDate = startDate;
    this._plannedEndDate = endDate;
    this._updatedAt = new Date();
  }

  updateActualDates(startDate: Date | null, endDate: Date | null): void {
    this._actualStartDate = startDate;
    this._actualEndDate = endDate;
    this._updatedAt = new Date();
  }

  updateWorkerGroups(workerGroups: any[]): void {
    this._workerGroups = workerGroups;
    // When worker groups are updated from DB, we also sync the IDs
    this._workerGroupIds = workerGroups.map(
      (wg: any) => wg.workerGroupId || wg.id,
    );
    this._updatedAt = new Date();
  }

  setWorkerGroupIds(ids: string[]): void {
    this._workerGroupIds = ids;
    this._updatedAt = new Date();
  }
}
