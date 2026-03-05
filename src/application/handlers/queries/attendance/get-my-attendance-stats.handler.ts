import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  AttendanceSummary,
  ATTENDANCE_QUERY_READER,
} from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { GetMyAttendanceStatsQuery } from '../../../queries/attendance/get-my-attendance-stats.query';

export interface AttendanceStats {
  hoursThisWeek: number;
  hoursThisMonth: number;
  attendanceRate: number;
  lateArrivals: number;
}

@QueryHandler(GetMyAttendanceStatsQuery)
export class GetMyAttendanceStatsHandler implements IQueryHandler<
  GetMyAttendanceStatsQuery,
  AttendanceSummary
> {
  constructor(
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(query: GetMyAttendanceStatsQuery): Promise<AttendanceSummary> {
    const today = new Date();

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const statsStartDate =
      startOfMonth < startOfWeek ? startOfMonth : startOfWeek;

    const records =
      await this.attendanceQueryReader.findByUserProjectAndDateRange(
        query.userId,
        query.projectId || '',
        statsStartDate,
        today,
      );

    let hoursThisWeek = 0;
    let hoursThisMonth = 0;
    let lateArrivals = 0;
    let presentDays = 0;

    records.forEach((record) => {
      const recordDate = new Date(record.date);
      const hours = record.workHours?.value || 0;

      if (recordDate >= startOfWeek) {
        hoursThisWeek += hours;
      }
      if (recordDate >= startOfMonth) {
        hoursThisMonth += hours;
        presentDays++;
      }

      if (record.checkIn) {
        const checkInTime = new Date(record.checkIn);
        if (
          checkInTime.getHours() > 9 ||
          (checkInTime.getHours() === 9 && checkInTime.getMinutes() > 0)
        ) {
          lateArrivals++;
        }
      }
    });

    const daysInMonthSoFar = today.getDate();
    const workingDays = Math.max(1, Math.floor((daysInMonthSoFar * 5) / 7));
    const attendanceRate = Math.min(
      100,
      Math.round((presentDays / workingDays) * 100),
    );

    return {
      weeklyHours: Number(hoursThisWeek.toFixed(1)),
      monthlyHours: Number(hoursThisMonth.toFixed(1)),
      attendanceRate,
      lateArrivals,
    };
  }
}
