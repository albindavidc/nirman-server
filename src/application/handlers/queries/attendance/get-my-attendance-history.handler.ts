import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ATTENDANCE_QUERY_READER } from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { PaginatedAttendanceDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';
import { GetMyAttendanceHistoryQuery } from '../../../queries/attendance/get-my-attendance-history.query';

@QueryHandler(GetMyAttendanceHistoryQuery)
export class GetMyAttendanceHistoryHandler implements IQueryHandler<GetMyAttendanceHistoryQuery> {
  constructor(
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(
    query: GetMyAttendanceHistoryQuery,
  ): Promise<PaginatedAttendanceDto> {
    const { userId, ...filters } = query.params;

    const result = await this.attendanceQueryReader.findByUserPaginated(
      userId,
      {
        projectId: filters.projectId,
        startDate: filters.startDate,
        endDate: filters.endDate,
        status: filters.status,
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
      },
    );

    return {
      data: result.data.map((entity) => AttendanceMapper.toResponseDto(entity)),
      meta: {
        totalItems: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }
}
