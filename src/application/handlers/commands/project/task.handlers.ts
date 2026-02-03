import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  CreateTaskCommand,
  UpdateTaskCommand,
  DeleteTaskCommand,
  AddTaskDependencyCommand,
  RemoveTaskDependencyCommand,
} from '../../../commands/project/task.commands';
import {
  TASK_REPOSITORY,
  ITaskRepository,
  Task,
  TaskDependency,
} from '../../../../domain/repositories/task-repository.interface';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(command: CreateTaskCommand): Promise<Task> {
    const { dto } = command;
    return this.taskRepository.create({
      phaseId: dto.phaseId,
      name: dto.name,
      description: dto.description || null,
      assignedTo: dto.assignedTo || null,
      plannedStartDate: dto.plannedStartDate
        ? new Date(dto.plannedStartDate)
        : undefined,
      plannedEndDate: dto.plannedEndDate
        ? new Date(dto.plannedEndDate)
        : undefined,
      priority: dto.priority,
      status: dto.status,
      notes: dto.notes || null,
    });
  }
}

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<Task> {
    const { id, dto } = command;
    return this.taskRepository.update(id, {
      name: dto.name,
      description: dto.description || undefined,
      assignedTo: dto.assignedTo || undefined,
      plannedStartDate: dto.plannedStartDate
        ? new Date(dto.plannedStartDate)
        : undefined,
      plannedEndDate: dto.plannedEndDate
        ? new Date(dto.plannedEndDate)
        : undefined,
      actualStartDate: dto.actualStartDate
        ? new Date(dto.actualStartDate)
        : undefined,
      actualEndDate: dto.actualEndDate
        ? new Date(dto.actualEndDate)
        : undefined,
      status: dto.status,
      priority: dto.priority,
      progress: dto.progress,
      notes: dto.notes || undefined,
    });
  }
}

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    await this.taskRepository.delete(command.id);
  }
}

@CommandHandler(AddTaskDependencyCommand)
export class AddTaskDependencyHandler implements ICommandHandler<AddTaskDependencyCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(command: AddTaskDependencyCommand): Promise<TaskDependency> {
    const { dto } = command;

    // Ensure successor exists to get valid phaseId
    const successor = await this.taskRepository.findById(dto.successorTaskId);
    if (!successor) {
      throw new Error('Successor task not found');
    }

    return this.taskRepository.addDependency({
      phaseId: successor.phaseId,
      successorTaskId: dto.successorTaskId,
      predecessorTaskId: dto.predecessorTaskId,
      type: dto.type || 'FS',
      lagTime: dto.lagTime || 0,
      notes: null, // Initialize with null if no notes provided
    });
  }
}

@CommandHandler(RemoveTaskDependencyCommand)
export class RemoveTaskDependencyHandler implements ICommandHandler<RemoveTaskDependencyCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskRepository: ITaskRepository,
  ) {}

  async execute(command: RemoveTaskDependencyCommand): Promise<void> {
    await this.taskRepository.removeDependency(command.id);
  }
}
