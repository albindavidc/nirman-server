import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ATTENDANCE_QUERY_READER } from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';
import { GetProjectAttendanceQuery } from '../../../queries/attendance/get-project-attendance.query';

@QueryHandler(GetProjectAttendanceQuery)
export class GetProjectAttendanceHandler implements IQueryHandler<GetProjectAttendanceQuery> {
  constructor(
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(
    query: GetProjectAttendanceQuery,
  ): Promise<AttendanceResponseDto[]> {
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
    return records.map((record) => AttendanceMapper.toResponseDto(record));
  }
}
