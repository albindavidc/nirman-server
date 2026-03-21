import { Query } from '@nestjs/cqrs';
import { AttendanceResponseDto } from '../../dto/attendance/attendance-response.dto';

export class GetProjectAttendanceQuery extends Query<AttendanceResponseDto[]> {
  constructor(
    public readonly projectId: string,
    public readonly date: Date,
  ) {
    super();
  }
}
