import { IQuery } from '@nestjs/cqrs';

export class GetMyAttendanceStatsQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
  ) {}
}
