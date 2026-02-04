import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectAttendanceStatsQuery } from '../../../queries/attendance/get-project-attendance-stats.query';
import { Inject } from '@nestjs/common';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';

@QueryHandler(GetProjectAttendanceStatsQuery)
export class GetProjectAttendanceStatsHandler implements IQueryHandler<GetProjectAttendanceStatsQuery> {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly attendanceRepository: IAttendanceRepository,
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

    const records = await this.attendanceRepository.findByProjectAndDateRange(
      projectId,
      startOfDay,
      endOfDay,
    );

    const total = records.length;

    const present = records.filter((r) => r.status === 'Present').length;
    const late = records.filter((r) => r.status === 'Late').length;
    const absent = records.filter((r) => r.status === 'Absent').length;

    const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0;

    return {
      attendanceRate: Math.round(attendanceRate),
      presentToday: present,
      lateArrivals: late,
      absent: absent,
    };
  }
}
