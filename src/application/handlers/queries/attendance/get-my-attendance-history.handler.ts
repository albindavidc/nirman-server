import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetMyAttendanceHistoryQuery } from '../../../queries/attendance/get-my-attendance-history.query';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';
import { AttendanceMapper } from '../../../../infrastructure/mappers/attendance.mapper';
import { PaginatedAttendanceDto } from '../../../dto/attendance/attendance-response.dto';

@QueryHandler(GetMyAttendanceHistoryQuery)
export class GetMyAttendanceHistoryHandler implements IQueryHandler<GetMyAttendanceHistoryQuery> {
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(
    query: GetMyAttendanceHistoryQuery,
  ): Promise<PaginatedAttendanceDto> {
    const { userId, ...filters } = query.params;

    const result = await this.attendanceRepository.findByUserPaginated(userId, {
      projectId: filters.projectId,
      startDate: filters.startDate,
      endDate: filters.endDate,
      status: filters.status,
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
    });

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
