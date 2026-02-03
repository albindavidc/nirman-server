/**
 * Attendance Repository Interface
 *
 * Defines the contract for attendance persistence operations.
 */

export interface AttendanceRecord {
  id: string;
  userId: string;
  projectId: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
  location: string | null;
  workHours: number | null;
  method: string;
  supervisorNotes: string | null;
  isVerified: boolean;
  verifiedBy: string | null;
  verifiedAt: Date | null;
}

export interface IAttendanceRepository {
  findByProjectAndDateRange(
    projectId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AttendanceRecord[]>;

  findById(id: string): Promise<AttendanceRecord | null>;

  findByUserProjectDate(
    userId: string,
    projectId: string,
    date: Date,
  ): Promise<AttendanceRecord | null>;

  findByUserAndDateRange(
    userId: string,
    projectId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AttendanceRecord[]>;

  create(data: Partial<AttendanceRecord>): Promise<AttendanceRecord>;
  update(
    id: string,
    data: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord>;
}

/**
 * Injection token for the Attendance repository
 */
export const ATTENDANCE_REPOSITORY = Symbol('ATTENDANCE_REPOSITORY');
