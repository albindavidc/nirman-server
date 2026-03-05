import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ATTENDANCE_QUERY_READER } from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { AttendanceValue } from '../../../../domain/value-objects/attendance.vo';
import { GetProjectAttendanceStatsQuery } from '../../../queries/attendance/get-project-attendance-stats.query';

@QueryHandler(GetProjectAttendanceStatsQuery)
export class GetProjectAttendanceStatsHandler implements IQueryHandler<GetProjectAttendanceStatsQuery> {
  constructor(
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(query: GetProjectAttendanceStatsQuery): Promise<{
    attendanceRate: number;
    presentToday: number;
    lateArrivals: number;
    absent: number;
  }> {
    const { projectId, date } = query;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const records = await this.attendanceQueryReader.findByProjectAndDateRange(
      projectId,
      startOfDay,
      endOfDay,
    );

    const total = records.length;

    const present = records.filter(
      (r) => r.status.value === AttendanceValue.ON_TIME,
    ).length;
    const late = records.filter(
      (r) => r.status.value === AttendanceValue.LATE,
    ).length;
    const absent = records.filter(
      (r) => r.status.value === AttendanceValue.ABSENT,
    ).length;

    const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0;

    return {
      attendanceRate: Math.round(attendanceRate),
      presentToday: present,
      lateArrivals: late,
      absent: absent,
    };
  }
}
