import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';
import { AttendanceMapper } from '../../../../infrastructure/mappers/attendance.mapper';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { GetTodayAttendanceQuery } from '../../../queries/attendance/get-my-today-attendance.query';

@QueryHandler(GetTodayAttendanceQuery)
export class GetTodayAttendanceHandler implements IQueryHandler<GetTodayAttendanceQuery> {
  constructor(private readonly attendanceRepository: IAttendanceRepository) {}
  async execute(
    query: GetTodayAttendanceQuery,
  ): Promise<AttendanceResponseDto | null> {
    const record = await this.attendanceRepository.findTodayByUser(
      query.userId,
      query.projectId,
    );

    return record ? AttendanceMapper.toResponseDto(record) : null;
  }
}
