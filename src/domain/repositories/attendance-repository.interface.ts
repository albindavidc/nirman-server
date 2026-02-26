/**
 * Attendance Repository Interface
 */

import { AttendanceEntity } from '../entities/attendance.entity';

export interface AttendanceFilter {
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAttendance {
  data: AttendanceEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AttendanceSummary {
  weeklyHours: number;
  monthlyHours: number;
  attendanceRate: number;
  lateArrivals: number;
}

export abstract class IAttendanceRepository {
  abstract findById(id: string): Promise<AttendanceEntity | null>;

  abstract findTodayByUser(
    userId: string,
    projectId: string,
  ): Promise<AttendanceEntity | null>;

  abstract findByUserPaginated(
    userId: string,
    filters: AttendanceFilter,
  ): Promise<PaginatedAttendance>;

  abstract getSummaryByUser(
    userId: string,
    projectId: string,
  ): Promise<AttendanceSummary>;

  abstract save(attendance: AttendanceEntity): Promise<AttendanceEntity>;
  abstract update(attendance: AttendanceEntity): Promise<AttendanceEntity>;

  abstract existsTodayForUser(
    userId: string,
    projectId: string,
  ): Promise<boolean>;

  //   findByProject_Date_Range(
  //     projectId: string,
  //     startDate: Date,
  //     endDate: Date,
  //   ): Promise<AttendanceEntity[]>;

  //   findByUserProjectDate(
  //     userId: string,
  //     projectId: string,
  //     date: Date,
  //   ): Promise<AttendanceEntity | null>;

  //   findByUserProjectDateRange(
  //     userId: string,
  //     projectId: string,
  //     startDate: Date,
  //     endDate: Date,
  //   ): Promise<AttendanceEntity[]>;

  //   create(data: Partial<AttendanceEntity>): Promise<AttendanceEntity>;
  //   update(
  //     id: string,
  //     data: Partial<AttendanceEntity>,
  //   ): Promise<AttendanceEntity>;
}
