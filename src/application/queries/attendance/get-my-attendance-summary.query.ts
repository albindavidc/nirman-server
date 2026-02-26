import { IQuery } from '@nestjs/cqrs';

export class GetMyAttendanceSummaryQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
  ) {}
}
