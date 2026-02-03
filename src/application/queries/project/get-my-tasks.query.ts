import { IQuery } from '@nestjs/cqrs';

export class GetMyTasksQuery implements IQuery {
  constructor(public readonly userId: string) {}
}
