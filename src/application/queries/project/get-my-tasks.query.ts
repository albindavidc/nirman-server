import { Query } from '@nestjs/cqrs';
import { TaskEntity } from '../../../domain/entities/task.entity';

export class GetMyTasksQuery extends Query<TaskEntity[]> {
  constructor(public readonly userId: string) {
    super();
  }
}
