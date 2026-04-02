import { AggregateRoot } from "@nestjs/cqrs";

export interface WorkerGroupMemberProps {
  id: string;
  workerGroupId: string;
  workerId: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export class WorkerGroupMemberEntity extends AggregateRoot {
  private _id: string;
  private _workerGroupId: string;
  private _workerId: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _isDeleted: boolean;
  private _deletedAt?: Date;

  constructor(props: WorkerGroupMemberProps) {
    super();
    this._id = props.id;
    this._workerGroupId = props.workerGroupId;
    this._workerId = props.workerId;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._isDeleted = props.isDeleted;
    this._deletedAt = props.deletedAt;
  }

  get id(): string {
    return this._id;
  }

  get workerGroupId(): string {
    return this._workerGroupId;
  }

  get workerId(): string {
    return this._workerId;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get isDeleted(): boolean {
    return this._isDeleted;
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt;
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  activate(): void {
    this._isActive = true;
    this._updatedAt = new Date();
  }

  delete(): void {
    this._isDeleted = true;
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }
}
