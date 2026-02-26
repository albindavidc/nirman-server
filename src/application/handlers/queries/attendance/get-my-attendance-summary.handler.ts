import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMyAttendanceSummaryQuery } from '../../../queries/attendance/get-my-attendance-summary.query';
import { AttendanceSummaryResponseDto } from '../../../dto/attendance/attendance-summary-response.dto';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@QueryHandler(GetMyAttendanceSummaryQuery)
export class GetMyAttendanceSummaryHandler implements IQueryHandler<GetMyAttendanceSummaryQuery> {
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(
    query: GetMyAttendanceSummaryQuery,
  ): Promise<AttendanceSummaryResponseDto> {
    const summary = await this.attendanceRepository.getSummaryByUser(
      query.userId,
      query.projectId,
    );

    return summary;
  }
}
