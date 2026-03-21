import { Query } from '@nestjs/cqrs';
import { PaginatedAttendanceDto } from '../../dto/attendance/attendance-response.dto';

export interface GetHistoryQueryParams {
  userId: string;
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  page?: number;
  limit?: number;
}

export class GetMyAttendanceHistoryQuery extends Query<PaginatedAttendanceDto> {
  constructor(public readonly params: GetHistoryQueryParams) {
    super();
  }
}
