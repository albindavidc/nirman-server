import { AggregateRoot } from '@nestjs/cqrs';
import { MaterialRequestStatus } from '../enums/material-request-status.enum';
import { MaterialRequestPriority } from '../enums/material-request-priority.enum';

export class MaterialRequest extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private _requestNumber: string,
    private _projectId: string,
    private _requestedBy: string,
    private _items: MaterialRequestItem[],
    private _priority: MaterialRequestPriority,
    private _purpose: string | null,
    private _deliveryLocation: string | null,
    private _requiredDate: Date,
    private _status: MaterialRequestStatus,
    private _approvedBy: string | null,
    private _approvedAt: Date | null,
    private _approvalComments: string | null,
    private _rejectionReason: string | null,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  /* Getters */
  get id(): string {
    return this._id;
  }
  get requestNumber(): string {
    return this._requestNumber;
  }
  get projectId(): string {
    return this._projectId;
  }
  get requestedBy(): string {
    return this._requestedBy;
  }
  get items(): Readonly<MaterialRequestItem[]> {
    return this._items;
  }
  get priority(): MaterialRequestPriority {
    return this._priority;
  }
  get purpose(): string | null {
    return this._purpose;
  }
  get deliveryLocation(): string | null {
    return this._deliveryLocation;
  }
  get requiredDate(): Date {
    return this._requiredDate;
  }
  get status(): MaterialRequestStatus {
    return this._status;
  }
  get approvedBy(): string | null {
    return this._approvedBy;
  }
  get approvedAt(): Date | null {
    return this._approvedAt;
  }
  get approvalComments(): string | null {
    return this._approvalComments;
  }
  get rejectionReason(): string | null {
    return this._rejectionReason;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /* Domain mutation methods */
  updateRequestNumber(requestNumber: string): void {
    this._requestNumber = requestNumber;
    this._updatedAt = new Date();
  }

  updateStatus(status: MaterialRequestStatus): void {
    this._status = status;
    this._updatedAt = new Date();
  }

  updateApprovedBy(approvedBy: string): void {
    this._approvedBy = approvedBy;
    this._updatedAt = new Date();
  }

  updateApprovedAt(approvedAt: Date): void {
    this._approvedAt = approvedAt;
    this._updatedAt = new Date();
  }

  updateApprovalComments(approvalComments: string): void {
    this._approvalComments = approvalComments;
    this._updatedAt = new Date();
  }

  updateRejectionReason(rejectionReason: string): void {
    this._rejectionReason = rejectionReason;
    this._updatedAt = new Date();
  }
}

export class MaterialRequestItem {
  constructor(
    public materialId: string,
    public materialName: string,
    public quantity: number,
    public unit: string,
  ) {}
}
