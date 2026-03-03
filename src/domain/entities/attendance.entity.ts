import { AttendanceMethod } from '../value-objects/attendance-method.vo';
import { AttendanceStatus } from '../value-objects/attendance.vo';
import { WorkHours } from '../value-objects/work-hours.vo';
export interface AttendanceProps {
  id: string | null;
  projectId: string;
  userId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: AttendanceStatus;
  location: string | null;
  workHours: WorkHours | null;
  method: AttendanceMethod;
  supervisorNotes: string | null;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
}

export class AttendanceEntity {
  private readonly _id: string | null;
  private _projectId: string;
  private _userId: string;
  private _date: Date;
  private _checkIn: Date | null;
  private _checkOut: Date | null;
  private _status: AttendanceStatus;
  private _location: string | null;
  private _workHours: WorkHours | null;
  private _method: AttendanceMethod;
  private _supervisorNotes: string | null;
  private _isVerified: boolean;
  private _verifiedBy: string | null;
  private _verifiedAt: Date | null;

  constructor(props: AttendanceProps) {
    this._id = props.id;
    this._projectId = props.projectId;
    this._userId = props.userId;
    this._date = props.date;
    this._checkIn = props.checkIn;
    this._checkOut = props.checkOut;
    this._status = props.status;
    this._location = props.location;
    this._workHours = props.workHours;
    this._method = props.method;
    this._supervisorNotes = props.supervisorNotes;
    this._isVerified = props.isVerified;
    this._verifiedBy = props.verifiedBy;
    this._verifiedAt = props.verifiedAt;
  }

  static reconstitute(props: AttendanceProps): AttendanceEntity {
    return new AttendanceEntity(props);
  }

  static recordCheckIn(params: {
    projectId: string;
    userId: string;
    location?: string;
    method?: AttendanceMethod;
    supervisorNotes?: string;
  }): AttendanceEntity {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const status = AttendanceStatus.determineFromCheckInTime(now);

    return new AttendanceEntity({
      id: null,
      projectId: params.projectId,
      userId: params.userId,
      date: today,
      checkIn: now,
      checkOut: null,
      status,
      location: params.location ?? null,
      workHours: null,
      method: params.method ?? AttendanceMethod.MANUAL,
      supervisorNotes: params.supervisorNotes ?? null,
      isVerified: false,

      verifiedBy: null,
      verifiedAt: null,
    });
  }

  recordCheckOut(location?: string | null, notes?: string | null): void {
    if (this._checkOut) {
      throw new Error('Already checked out');
    }
    if (!this._checkIn) {
      throw new Error('Cannot check out without checking in');
    }

    const now = new Date();
    this._workHours = WorkHours.calculate(this._checkIn, now);
    this._checkOut = now;

    if (location !== undefined) {
      this._location = location;
    }
    if (notes !== undefined) {
      this._supervisorNotes = notes;
    }
  }

  verify(supervisorId: string, isVerified: boolean, notes?: string): void {
    this._isVerified = isVerified;
    this._verifiedBy = supervisorId;
    this._verifiedAt = new Date();
    if (notes !== undefined) this._supervisorNotes = notes;
  }

  isCheckedIn(): boolean {
    return !!this._checkIn;
  }

  isCheckedOut(): boolean {
    return !!this._checkOut;
  }

  isLate(): boolean {
    return this._status === AttendanceStatus.LATE;
  }

  /**
   * Getters
   */

  get id(): string | null {
    return this._id;
  }
  get projectId(): string {
    return this._projectId;
  }
  get userId(): string {
    return this._userId;
  }

  get date(): Date {
    return this._date;
  }
  get checkIn(): Date | null {
    return this._checkIn;
  }
  get checkOut(): Date | null {
    return this._checkOut;
  }
  get status(): AttendanceStatus {
    return this._status;
  }
  get location(): string | null {
    return this._location;
  }
  get workHours(): WorkHours | null {
    return this._workHours;
  }
  get method(): AttendanceMethod {
    return this._method;
  }
  get supervisorNotes(): string | null {
    return this._supervisorNotes;
  }
  get isVerified(): boolean {
    return this._isVerified;
  }
  get verifiedBy(): string | null {
    return this._verifiedBy;
  }
  get verifiedAt(): Date | null {
    return this._verifiedAt;
  }
}
