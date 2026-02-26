import { IQuery } from '@nestjs/cqrs';

export class GetMyTodayAttendanceQuery implements IQuery {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
  ) {}
}
