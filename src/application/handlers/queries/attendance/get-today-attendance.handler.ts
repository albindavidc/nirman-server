import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ATTENDANCE_QUERY_READER } from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { Inject } from '@nestjs/common';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';
import { GetMyTodayAttendanceQuery } from '../../../queries/attendance/get-my-today-attendance.query';

@QueryHandler(GetMyTodayAttendanceQuery)
export class GetTodayAttendanceHandler implements IQueryHandler<GetMyTodayAttendanceQuery> {
  constructor(
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}
  async execute(
    query: GetMyTodayAttendanceQuery,
  ): Promise<AttendanceResponseDto | null> {
    const record = await this.attendanceQueryReader.findTodayByUser(
      query.userId,
      query.projectId,
    );

    return record ? AttendanceMapper.toResponseDto(record) : null;
  }
}
