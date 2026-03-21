import { Command } from '@nestjs/cqrs';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateTaskDependencyDto,
} from '../../dto/project/task.dto';
import {
  TaskEntity,
  TaskDependencyEntity,
} from '../../../domain/entities/task.entity';

export class CreateTaskCommand extends Command<TaskEntity> {
  constructor(public readonly dto: CreateTaskDto) {
    super();
  }
}

export class UpdateTaskCommand extends Command<TaskEntity> {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateTaskDto,
  ) {
    super();
  }
}

export class DeleteTaskCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}

export class AddTaskDependencyCommand extends Command<TaskDependencyEntity> {
  constructor(public readonly dto: CreateTaskDependencyDto) {
    super();
  }
}

export class RemoveTaskDependencyCommand extends Command<void> {
  constructor(public readonly id: string) {
    super();
  }
}
