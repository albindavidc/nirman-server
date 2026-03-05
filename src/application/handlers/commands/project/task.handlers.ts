import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  CreateTaskCommand,
  UpdateTaskCommand,
  DeleteTaskCommand,
  AddTaskDependencyCommand,
  RemoveTaskDependencyCommand,
} from '../../../commands/project/task.commands';
import { TASK_REPOSITORY } from '../../../../domain/repositories/project-phase/task.repository.interface';
import { TASK_QUERY_REPOSITORY } from '../../../../domain/repositories/project-phase/task.query-repository.interface';
import { ITaskWriter } from '../../../../domain/repositories/project-phase/task.writer.interface';
import { ITaskReader } from '../../../../domain/repositories/project-phase/task.reader.interface';
import {
  TaskEntity,
  TaskDependencyEntity,
  TaskStatus,
  TaskPriority,
} from '../../../../domain/entities/task.entity';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler implements ICommandHandler<CreateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskWriter: ITaskWriter,
  ) {}

  async execute(command: CreateTaskCommand): Promise<TaskEntity> {
    const { dto } = command;
    return this.taskWriter.save({
      id: '',
      phaseId: dto.phaseId,
      name: dto.name,
      description: dto.description || null,
      assignedTo: dto.assignedTo || null,
      plannedStartDate: dto.plannedStartDate
        ? new Date(dto.plannedStartDate)
        : null,
      plannedEndDate: dto.plannedEndDate ? new Date(dto.plannedEndDate) : null,
      actualStartDate: null,
      actualEndDate: null,
      priority: (dto.priority as TaskPriority) || TaskPriority.MEDIUM,
      status: (dto.status as TaskStatus) || TaskStatus.TODO,
      progress: 0,
      notes: dto.notes || null,
      color: dto.color || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as TaskEntity);
  }
}

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler implements ICommandHandler<UpdateTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskWriter: ITaskWriter,
    @Inject(TASK_QUERY_REPOSITORY) private readonly taskReader: ITaskReader,
  ) {}

  async execute(command: UpdateTaskCommand): Promise<TaskEntity> {
    const { id, dto } = command;

    const existing = await this.taskReader.findById(id);
    if (!existing) {
      throw new Error(`Task with ID ${id} not found`);
    }

    return this.taskWriter.save({
      ...existing,
      name: dto.name || existing.name,
      description:
        dto.description !== undefined ? dto.description : existing.description,
      assignedTo:
        dto.assignedTo !== undefined ? dto.assignedTo : existing.assignedTo,
      plannedStartDate: dto.plannedStartDate
        ? new Date(dto.plannedStartDate)
        : existing.plannedStartDate,
      plannedEndDate: dto.plannedEndDate
        ? new Date(dto.plannedEndDate)
        : existing.plannedEndDate,
      actualStartDate: dto.actualStartDate
        ? new Date(dto.actualStartDate)
        : existing.actualStartDate,
      actualEndDate: dto.actualEndDate
        ? new Date(dto.actualEndDate)
        : existing.actualEndDate,
      status: dto.status || existing.status,
      priority: dto.priority || existing.priority,
      progress: dto.progress !== undefined ? dto.progress : existing.progress,
      notes: dto.notes !== undefined ? dto.notes : existing.notes,
      color: dto.color !== undefined ? dto.color : existing.color,
      updatedAt: new Date(),
    } as TaskEntity);
  }
}

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler implements ICommandHandler<DeleteTaskCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskWriter: ITaskWriter,
  ) {}

  async execute(command: DeleteTaskCommand): Promise<void> {
    await this.taskWriter.softDelete(command.id);
  }
}

@CommandHandler(AddTaskDependencyCommand)
export class AddTaskDependencyHandler implements ICommandHandler<AddTaskDependencyCommand> {
  constructor(
    @Inject(TASK_REPOSITORY) private readonly taskWriter: ITaskWriter,
    @Inject(TASK_QUERY_REPOSITORY) private readonly taskReader: ITaskReader,
  ) {}

  async execute(
    command: AddTaskDependencyCommand,
  ): Promise<TaskDependencyEntity> {
    const { dto } = command;

    const successor = await this.taskReader.findById(dto.successorTaskId);
    if (!successor) {
      throw new Error('Successor task not found');
    }

    return this.taskWriter.addDependency({
      id: '',
      phaseId: successor.phaseId,
      successorTaskId: dto.successorTaskId,
      predecessorTaskId: dto.predecessorTaskId,
      type: dto.type || 'FS',
      lagTime: dto.lagTime || 0,
      notes: null,
    } as TaskDependencyEntity);
  }
}

@CommandHandler(RemoveTaskDependencyCommand)
export class RemoveTaskDependencyHandler implements ICommandHandler<RemoveTaskDependencyCommand> {
  constructor(
    @Inject(TASK_REPOSITORY)
    private readonly taskWriter: ITaskWriter,
  ) {}

  async execute(command: RemoveTaskDependencyCommand): Promise<void> {
    await this.taskWriter.removeDependency(command.id);
  }
}
