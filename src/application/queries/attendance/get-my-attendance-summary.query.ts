import { Query } from '@nestjs/cqrs';
import { AttendanceSummaryResponseDto } from '../../dto/attendance/attendance-summary-response.dto';

export class GetMyAttendanceSummaryQuery extends Query<AttendanceSummaryResponseDto> {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
  ) {
    super();
  }
}
