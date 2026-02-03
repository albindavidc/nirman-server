import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectAttendanceQuery } from '../../../../application/queries/project/get-project-attendance.query';
import { AttendanceResponseDto } from '../../../../application/dto/project/attendance-response.dto';
import {
  IProjectMemberRepository,
  PROJECT_MEMBER_REPOSITORY,
} from '../../../../domain/repositories/project-member-repository.interface';
import {
  IAttendanceRepository,
  ATTENDANCE_REPOSITORY,
} from '../../../../domain/repositories/attendance-repository.interface';

@QueryHandler(GetProjectAttendanceQuery)
export class GetProjectAttendanceHandler implements IQueryHandler<GetProjectAttendanceQuery> {
  constructor(
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: IProjectMemberRepository,
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

    // Fetch Project Members with user details
    const members =
      await this.projectMemberRepository.findByProjectId(projectId);

    if (members.length === 0) {
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
    return members.map((member) => {
      const record = attendanceMap.get(member.userId);

      return {
        id: record?.id ?? `pending-${member.userId}`,
        workerId: member.userId,
        workerName: member.user
          ? `${member.user.firstName} ${member.user.lastName}`
          : 'Unknown',
        workerRole: member.role,
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
