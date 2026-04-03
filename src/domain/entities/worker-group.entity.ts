import { AggregateRoot } from '@nestjs/cqrs';
import { TradeType } from '../enums/trade-type.enum';

export interface WorkerGroupMember {
  id: string;
  groupId: string;
  workerId: string;
  memberName: string;
  memberPhotoUrl: string | null;
  joinedAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
}

export interface WorkerGroupProps {
  id: string;
  name: string;
  description: string;
  trade: TradeType;
  projectId: string;
  createdById: string;
  isActive: boolean;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  members: WorkerGroupMember[];
}

export class WorkerGroupEntity extends AggregateRoot {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private _trade: TradeType;
  private _projectId: string;
  private _createdById: string;
  private _isActive: boolean;
  private _memberCount: number;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _isDeleted: boolean;
  private _deletedAt?: Date;
  private _members: WorkerGroupMember[];

  constructor(props: WorkerGroupProps) {
    super();
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._trade = props.trade;
    this._projectId = props.projectId;
    this._createdById = props.createdById;
    this._isActive = props.isActive;
    this._memberCount = props.memberCount;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._isDeleted = props.isDeleted;
    this._deletedAt = props.deletedAt;
    this._members = props.members;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get trade(): string {
    return this._trade;
  }

  get projectId(): string {
    return this._projectId;
  }

  get createdById(): string {
    return this._createdById;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get memberCount(): number {
    return this._memberCount;
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

  get members(): WorkerGroupMember[] {
    return this._members;
  }

  static create(props: WorkerGroupProps): WorkerGroupEntity {
    return new WorkerGroupEntity(props);
  }

  updateDetails(name?: string, description?: string, trade?: TradeType) {
    if (name) this._name = name;
    if (description) this._description = description;
    if (trade) this._trade = trade;
    this._updatedAt = new Date();
  }

  addMember(member: WorkerGroupMember) {
    this._members.push(member);
    this._updatedAt = new Date();
    this._memberCount++;
  }

  removeMember(memberId: string) {
    this._members = this._members.filter((m) => m.id !== memberId);
    this._updatedAt = new Date();
    this._memberCount--;
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
