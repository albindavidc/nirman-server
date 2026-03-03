import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';
import { GetMyTodayAttendanceQuery } from '../../../queries/attendance/get-my-today-attendance.query';

@QueryHandler(GetMyTodayAttendanceQuery)
export class GetTodayAttendanceHandler implements IQueryHandler<GetMyTodayAttendanceQuery> {
  constructor(private readonly attendanceRepository: IAttendanceRepository) {}
  async execute(
    query: GetMyTodayAttendanceQuery,
  ): Promise<AttendanceResponseDto | null> {
    const record = await this.attendanceRepository.findTodayByUser(
      query.userId,
      query.projectId,
    );

    return record ? AttendanceMapper.toResponseDto(record) : null;
  }
}
