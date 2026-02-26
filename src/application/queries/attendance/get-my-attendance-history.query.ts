import { IQuery } from '@nestjs/cqrs';

export interface GetHistoryQueryParams {
  userId: string;
  projectId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  page?: number;
  limit?: number;
}

export class GetMyAttendanceHistoryQuery implements IQuery {
  constructor(public readonly params: GetHistoryQueryParams) {}
}
