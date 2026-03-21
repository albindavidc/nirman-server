import { Query } from '@nestjs/cqrs';
import { AttendanceResponseDto } from '../../dto/attendance/attendance-response.dto';

export class GetMyTodayAttendanceQuery extends Query<AttendanceResponseDto | null> {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
  ) {
    super();
  }
}
