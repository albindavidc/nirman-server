import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMyAttendanceHistoryQuery } from '../../../queries/attendance/get-my-attendance-history.query';
import {
  ATTENDANCE_REPOSITORY,
  IAttendanceRepository,
  AttendanceRecord,
} from '../../../../domain/repositories/attendance-repository.interface';

@QueryHandler(GetMyAttendanceHistoryQuery)
export class GetMyAttendanceHistoryHandler implements IQueryHandler<GetMyAttendanceHistoryQuery> {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(
    query: GetMyAttendanceHistoryQuery,
  ): Promise<AttendanceRecord[]> {
    // For now, we fetch a range. In a real app we might want specific pagination in repo.
    // Using a large range for "limit" simulation or just fetching last 30 days.
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    const records = await this.attendanceRepository.findByUserAndDateRange(
      query.userId,
      query.projectId,
      startDate,
      endDate,
    );

    // Sort desc
    records.sort((a, b) => b.date.getTime() - a.date.getTime());

    return records.slice(query.offset, query.offset + query.limit);
  }
}
