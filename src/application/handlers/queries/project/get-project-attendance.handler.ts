import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AttendanceResponseDto } from '../../../../application/dto/project/attendance-response.dto';
import { GetProjectAttendanceQuery } from '../../../../application/queries/project/get-project-attendance.query';
import { ATTENDANCE_QUERY_READER } from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import {
  IProjectWorkerRepository,
  PROJECT_WORKER_REPOSITORY,
} from '../../../../domain/repositories/project/project-worker-repository.interface';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';

@QueryHandler(GetProjectAttendanceQuery)
export class GetProjectAttendanceHandler implements IQueryHandler<GetProjectAttendanceQuery> {
  constructor(
    @Inject(PROJECT_WORKER_REPOSITORY)
    private readonly projectWorkerRepository: IProjectWorkerRepository,
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(
    query: GetProjectAttendanceQuery,
  ): Promise<AttendanceResponseDto[]> {
    const { projectId, date } = query;
    const searchDate = date || new Date();

    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    const workers =
      await this.projectWorkerRepository.findByProjectId(projectId);

    if (workers.length === 0) {
      return [];
    }

    const attendanceRecords =
      await this.attendanceQueryReader.findByProjectAndDateRange(
        projectId,
        startOfDay,
        endOfDay,
      );

    const attendanceMap = new Map(attendanceRecords.map((a) => [a.userId, a]));

    return AttendanceMapper.toProjectAttendanceDtoList(
      workers,
      attendanceMap,
      searchDate,
    );
  }
}
