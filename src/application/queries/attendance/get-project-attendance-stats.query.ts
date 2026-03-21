import { Query } from '@nestjs/cqrs';

export class GetProjectAttendanceStatsQuery extends Query<{
  attendanceRate: number;
  presentToday: number;
  lateArrivals: number;
  absent: number;
}> {
  constructor(
    public readonly projectId: string,
    public readonly date: Date,
  ) {
    super();
  }
}
