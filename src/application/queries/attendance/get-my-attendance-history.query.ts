import { IQuery } from '@nestjs/cqrs';

export class GetMyAttendanceHistoryQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
    public readonly limit: number = 10,
    public readonly offset: number = 0,
  ) {}
}
