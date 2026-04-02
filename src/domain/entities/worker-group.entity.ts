import { AggregateRoot } from '@nestjs/cqrs';
import { WorkerGroupMemberEntity as WorkerGroupMember } from './worker-group-member.entity';

export interface WorkerGroupProps {
  id: string;
  name: string;
  description: string;
  trade: string;
  projectId: string;
  createdById: string;
  isActive: boolean;
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
  private _trade: string;
  private _projectId: string;
  private _createdById: string;
  private _isActive: boolean;
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

  updateDetails(name?: string, description?: string, trade?: string) {
    if (name) this._name = name;
    if (description) this._description = description;
    if (trade) this._trade = trade;
    this._updatedAt = new Date();
  }

  addMember(member: WorkerGroupMember) {
    this._members.push(member);
    this._updatedAt = new Date();
  }

  removeMember(memberId: string) {
    this._members = this._members.filter((m) => m.id !== memberId);
    this._updatedAt = new Date();
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
