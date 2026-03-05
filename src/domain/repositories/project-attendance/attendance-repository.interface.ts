/**
 * Attendance Repository Interface
 */

import { AttendanceEntity } from '../../entities/attendance.entity';

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

export const ATTENDANCE_READER = Symbol('IAttendanceReader');
export const ATTENDANCE_WRITER = Symbol('IAttendanceWriter');
export const ATTENDANCE_QUERY_READER = Symbol('IAttendanceQueryReader');
