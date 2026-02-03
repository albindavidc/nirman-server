import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMyAttendanceStatsQuery } from '../../../queries/attendance/get-my-attendance-stats.query';
import {
  ATTENDANCE_REPOSITORY,
  IAttendanceRepository,
} from '../../../../domain/repositories/attendance-repository.interface';

export interface AttendanceStats {
  hoursThisWeek: number;
  hoursThisMonth: number;
  attendanceRate: number;
  lateArrivals: number;
}

@QueryHandler(GetMyAttendanceStatsQuery)
export class GetMyAttendanceStatsHandler implements IQueryHandler<GetMyAttendanceStatsQuery> {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(query: GetMyAttendanceStatsQuery): Promise<AttendanceStats> {
    const today = new Date();

    // Start of Month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Start of Week (assuming Sunday start, or Monday depending on locale, let's use Monday)
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    // Fetch records for the month (covers week too usually, unless week crosses month boundary)
    // Safer to fetch from whichever is earlier.
    const statsStartDate =
      startOfMonth < startOfWeek ? startOfMonth : startOfWeek;

    const records = await this.attendanceRepository.findByUserAndDateRange(
      query.userId,
      query.projectId,
      statsStartDate,
      today,
    );

    let hoursThisWeek = 0;
    let hoursThisMonth = 0;
    let lateArrivals = 0;
    let presentDays = 0;

    // For attendance rate, we need to know "expected" working days.
    // This is hard without a schedule. We can approximate or just use present / (days elapsed in month - weekends).
    // Let's assume standard Mo-Fri work week for calculation.

    records.forEach((record) => {
      const recordDate = new Date(record.date);
      const hours = record.workHours || 0;

      if (recordDate >= startOfWeek) {
        hoursThisWeek += hours;
      }
      if (recordDate >= startOfMonth) {
        hoursThisMonth += hours;
        presentDays++;
      }

      // Late arrival logic? Maybe check_in > 9:00 AM?
      // Hardcoded 9 AM for now as per "08:45 AM" example suggests 9 is starts.
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

    // Calculate Attendance Rate (Simplified: Present / Working Days so far in month)
    const daysInMonthSoFar = today.getDate();
    // Rough estimate of working days: 5/7 of days.
    const workingDays = Math.max(1, Math.floor((daysInMonthSoFar * 5) / 7));
    const attendanceRate = Math.min(
      100,
      Math.round((presentDays / workingDays) * 100),
    );

    return {
      hoursThisWeek: Number(hoursThisWeek.toFixed(1)),
      hoursThisMonth: Number(hoursThisMonth.toFixed(1)),
      attendanceRate,
      lateArrivals,
    };
  }
}
