import { IQuery } from '@nestjs/cqrs';

export class GetProjectAttendanceStatsQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly date: Date,
  ) {}
}
