import { Query } from '@nestjs/cqrs';
import { AttendanceSummary } from '../../../domain/repositories/project-attendance/attendance-repository.interface';

export class GetMyAttendanceStatsQuery extends Query<AttendanceSummary> {
  constructor(
    public readonly userId: string,
    public readonly projectId?: string,
  ) {
    super();
  }
}
