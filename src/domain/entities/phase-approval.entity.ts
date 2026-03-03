import { AggregateRoot } from '@nestjs/cqrs';

export interface MediaItem {
  type: string;
  url: string;
}

export class PhaseApproval extends AggregateRoot {
  constructor(
    private readonly _id: string,
    private readonly _phaseId: string,
    private readonly _requestedBy: string,
    private _approvedBy: string | null,
    private _approvalStatus: string,
    private _comments: string | null,
    private _media: MediaItem[],
    private _approvedAt: Date | null,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  get id(): string {
    return this._id;
  }

  get phaseId(): string {
    return this._phaseId;
  }

  get requestedBy(): string {
    return this._requestedBy;
  }

  get approvedBy(): string | null {
    return this._approvedBy;
  }

  get approvalStatus(): string {
    return this._approvalStatus;
  }

  get comments(): string | null {
    return this._comments;
  }

  get media(): MediaItem[] {
    return this._media;
  }

  get approvedAt(): Date | null {
    return this._approvedAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  approve(approvedBy: string, comments: string | null): void {
    this._approvalStatus = 'approved';
    this._approvedBy = approvedBy;
    this._approvedAt = new Date();
    this._comments = comments;
    this._updatedAt = new Date();
  }

  reject(rejectedBy: string, comments: string | null): void {
    this._approvalStatus = 'rejected';
    this._approvedBy = rejectedBy; // Can reuse approvedBy for the decision maker
    this._approvedAt = new Date();
    this._comments = comments;
    this._updatedAt = new Date();
  }

  updateComments(comments: string | null): void {
    this._comments = comments;
    this._updatedAt = new Date();
  }

  addMedia(mediaItems: MediaItem[]): void {
    this._media = [...this._media, ...mediaItems];
    this._updatedAt = new Date();
  }
}
