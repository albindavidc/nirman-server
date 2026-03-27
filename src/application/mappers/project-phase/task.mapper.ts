import { Prisma } from '../../../generated/client/client';
import {
  Task,
  TaskDependency,
  TaskEntity,
  TaskDependencyEntity,
} from '../../../domain/entities/task.entity';
import {
  TaskRecord,
  TaskDependencyRecord,
} from '../../../infrastructure/types/task.types';

export class TaskMapper {
  static toDomain(record: TaskRecord): Task {
    return new Task({
      id: record.id,
      phaseId: record.phase_id,
      assignedTo: record.assigned_to,
      name: record.name,
      description: record.description,
      plannedStartDate: record.planned_start_date,
      plannedEndDate: record.planned_end_date,
      actualStartDate: record.actual_start_date,
      actualEndDate: record.actual_end_date,
      status: record.status,
      priority: record.priority,
      progress: record.progress,
      notes: record.notes,
      color: record.color,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      assignee: record.assignee
        ? {
            firstName: record.assignee.first_name,
            lastName: record.assignee.last_name,
            email: record.assignee.email,
          }
        : null,
    });
  }

  static toCreateInput(entity: TaskEntity): Prisma.TaskCreateInput {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      name: entity.name,
      description: entity.description,
      planned_start_date: entity.plannedStartDate,
      planned_end_date: entity.plannedEndDate,
      actual_start_date: entity.actualStartDate,
      actual_end_date: entity.actualEndDate,
      status: entity.status,
      priority: entity.priority,
      progress: entity.progress,
      notes: entity.notes,
      color: entity.color,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
      phase: {
        connect: { id: entity.phaseId },
      },
      ...(entity.assignedTo && {
        assignee: {
          connect: { id: entity.assignedTo },
        },
      }),
    };
  }

  static toUpdateInput(entity: TaskEntity): Prisma.TaskUpdateInput {
    return {
      name: entity.name,
      description: entity.description,
      planned_start_date: entity.plannedStartDate,
      planned_end_date: entity.plannedEndDate,
      actual_start_date: entity.actualStartDate,
      actual_end_date: entity.actualEndDate,
      status: entity.status,
      priority: entity.priority,
      progress: entity.progress,
      notes: entity.notes,
      color: entity.color,
      updated_at: entity.updatedAt,
      ...(entity.assignedTo !== undefined && {
        assignee: entity.assignedTo
          ? { connect: { id: entity.assignedTo } }
          : { disconnect: true },
      }),
    };
  }

  static dependencyToDomain(record: TaskDependencyRecord): TaskDependency {
    return new TaskDependency({
      id: record.id,
      phaseId: record.phase_id,
      successorTaskId: record.successor_task_id,
      predecessorTaskId: record.predecessor_task_id,
      type: record.type,
      lagTime: record.lag_time,
      notes: record.notes,
    });
  }

  static dependencyToCreateInput(
    entity: TaskDependencyEntity,
  ): Prisma.TaskDependencyCreateInput {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      type: entity.type,
      lag_time: entity.lagTime,
      notes: entity.notes,
      phase_id: entity.phaseId,
      successor: { connect: { id: entity.successorTaskId } },
      predecessor: { connect: { id: entity.predecessorTaskId } },
    };
  }
}
