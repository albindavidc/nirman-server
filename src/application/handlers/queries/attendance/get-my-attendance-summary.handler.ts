import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyAttendanceSummaryQuery } from '../../../queries/attendance/get-my-attendance-summary.query';
import { AttendanceSummaryResponseDto } from '../../../dto/attendance/attendance-summary-response.dto';
import { ATTENDANCE_QUERY_READER } from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@QueryHandler(GetMyAttendanceSummaryQuery)
export class GetMyAttendanceSummaryHandler implements IQueryHandler<GetMyAttendanceSummaryQuery> {
  constructor(
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(
    query: GetMyAttendanceSummaryQuery,
  ): Promise<AttendanceSummaryResponseDto> {
    const summary = await this.attendanceQueryReader.getSummaryByUser(
      query.userId,
      query.projectId,
    );

    return summary;
  }
}
