import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProjectAttendanceQuery } from '../../../queries/attendance/get-project-attendance.query';
import { Inject } from '@nestjs/common';
import {
  IAttendanceRepository,
  AttendanceRecord,
} from '../../../../domain/repositories/attendance-repository.interface';

@QueryHandler(GetProjectAttendanceQuery)
export class GetProjectAttendanceHandler implements IQueryHandler<GetProjectAttendanceQuery> {
  constructor(
    @Inject('IAttendanceRepository')
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(query: GetProjectAttendanceQuery): Promise<AttendanceRecord[]> {
    const { projectId, date } = query;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.attendanceRepository.findByProjectAndDateRange(
      projectId,
      startOfDay,
      endOfDay,
    );
  }
}
