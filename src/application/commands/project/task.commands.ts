import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateTaskDependencyDto,
} from '../../dto/project/task.dto';

export class CreateTaskCommand {
  constructor(public readonly dto: CreateTaskDto) {}
}

export class UpdateTaskCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdateTaskDto,
  ) {}
}

export class DeleteTaskCommand {
  constructor(public readonly id: string) {}
}

export class AddTaskDependencyCommand {
  constructor(public readonly dto: CreateTaskDependencyDto) {}
}

export class RemoveTaskDependencyCommand {
  constructor(public readonly id: string) {}
}
