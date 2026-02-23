import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectAttendanceQuery } from '../../../../application/queries/project/get-project-attendance.query';
import { AttendanceResponseDto } from '../../../../application/dto/project/attendance-response.dto';
import {
  IProjectWorkerRepository,
  PROJECT_WORKER_REPOSITORY,
} from '../../../../domain/repositories/project-worker-repository.interface';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../../domain/repositories/attendance-repository.interface';

@QueryHandler(GetProjectAttendanceQuery)
export class GetProjectAttendanceHandler implements IQueryHandler<GetProjectAttendanceQuery> {
  constructor(
    @Inject(PROJECT_WORKER_REPOSITORY)
    private readonly projectWorkerRepository: IProjectWorkerRepository,
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(
    query: GetProjectAttendanceQuery,
  ): Promise<AttendanceResponseDto[]> {
    const { projectId, date } = query;
    const searchDate = date ? new Date(date) : new Date();

    // Set time to start of day and end of day for filtering
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch Project Workers with user details
    const workers =
      await this.projectWorkerRepository.findByProjectId(projectId);

    if (workers.length === 0) {
      return [];
    }

    // Fetch Attendance for the day
    const attendanceRecords =
      await this.attendanceRepository.findByProjectAndDateRange(
        projectId,
        startOfDay,
        endOfDay,
      );

    // Create attendance map for quick lookup
    const attendanceMap = new Map(attendanceRecords.map((a) => [a.userId, a]));

    // Combine and Map to DTO
    return workers.map((worker) => {
      const record = attendanceMap.get(worker.userId);

      return {
        id: record?.id ?? `pending-${worker.userId}`,
        workerId: worker.userId,
        workerName: worker.user
          ? `${worker.user.firstName} ${worker.user.lastName}`
          : 'Unknown',
        workerRole: worker.role,
        date: searchDate.toISOString(),
        checkIn: record?.checkIn?.toISOString(),
        checkOut: record?.checkOut?.toISOString(),
        status: record?.status ?? 'absent',
        location: record?.location ?? undefined,
        workHours: record?.workHours ?? undefined,
        method: record?.method ?? 'Manual',
        supervisorNotes: record?.supervisorNotes,
        isVerified: record?.isVerified ?? false,
        verifiedBy: record?.verifiedBy,
        verifiedAt: record?.verifiedAt?.toISOString(),
      };
    });
  }
}
