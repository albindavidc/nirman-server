import { Query } from '@nestjs/cqrs';

export class GetProjectWorkersQuery extends Query<any[]> {
  constructor(public readonly projectId: string) {
    super();
  }
}
