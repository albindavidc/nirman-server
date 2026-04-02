import { Prisma, Status, TaskPriority as PrismaPriority } from '../../../generated/client/client';
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
      phaseId: record.phaseId,
      assignedTo: record.assignedTo,
      name: record.name,
      description: record.description,
      plannedStartDate: record.plannedStartDate,
      plannedEndDate: record.plannedEndDate,
      actualStartDate: record.actualStartDate,
      actualEndDate: record.actualEndDate,
      status: record.status,
      priority: record.priority,
      progress: record.progress,
      notes: record.notes,
      estimatedHours: record.estimatedHours,
      actualHours: record.actualHours,
      color: record.color,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      assignee: record.assignee
        ? {
            firstName: record.assignee.firstName,
            lastName: record.assignee.lastName,
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
      plannedStartDate: entity.plannedStartDate,
      plannedEndDate: entity.plannedEndDate,
      actualStartDate: entity.actualStartDate,
      actualEndDate: entity.actualEndDate,
      status: this.mapStatus(entity.status),
      priority: this.mapPriority(entity.priority),
      progress: entity.progress,
      notes: entity.notes,
      estimatedHours: entity.estimatedHours,
      actualHours: entity.actualHours,
      color: entity.color,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
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
      plannedStartDate: entity.plannedStartDate,
      plannedEndDate: entity.plannedEndDate,
      actualStartDate: entity.actualStartDate,
      actualEndDate: entity.actualEndDate,
      status: this.mapStatus(entity.status),
      priority: this.mapPriority(entity.priority),
      progress: entity.progress,
      notes: entity.notes,
      estimatedHours: entity.estimatedHours,
      actualHours: entity.actualHours,
      color: entity.color,
      updatedAt: entity.updatedAt,
      ...(entity.assignedTo !== undefined && {
        assignee: entity.assignedTo
          ? { connect: { id: entity.assignedTo } }
          : { disconnect: true },
      }),
    };
  }

  private static mapStatus(status: any): Status {
    const s = String(status).toLowerCase().replace(/\s+/g, '_');
    
    switch (s) {
      case 'todo':
      case 'not_started':
        return Status.not_started;
      case 'in_progress':
        return Status.in_progress;
      case 'in_review':
        return Status.in_progress; // Or Status.on_hold if appropriate
      case 'done':
      case 'completed':
        return Status.completed;
      case 'delayed':
        return Status.delayed;
      case 'on_hold':
        return Status.on_hold;
      default:
        // Fallback or default
        return Status.not_started;
    }
  }

  private static mapPriority(priority: any): PrismaPriority {
    const p = String(priority).toLowerCase();
    
    switch (p) {
      case 'low':
        return PrismaPriority.low;
      case 'medium':
        return PrismaPriority.medium;
      case 'high':
        return PrismaPriority.high;
      case 'critical':
        return PrismaPriority.critical;
      default:
        return PrismaPriority.medium;
    }
  }

  static dependencyToDomain(record: TaskDependencyRecord): TaskDependency {
    return new TaskDependency({
      id: record.id,
      phaseId: record.phaseId,
      successorTaskId: record.successorTaskId,
      predecessorTaskId: record.predecessorTaskId,
      type: record.type,
      lagTime: record.lagTime,
      notes: record.notes,
    });
  }

  static dependencyToCreateInput(
    entity: TaskDependencyEntity,
  ): Prisma.TaskDependencyCreateInput {
    return {
      ...(entity.id ? { id: entity.id } : {}),
      type: entity.type,
      lagTime: entity.lagTime,
      notes: entity.notes,
      phaseId: entity.phaseId,
      successor: { connect: { id: entity.successorTaskId } },
      predecessor: { connect: { id: entity.predecessorTaskId } },
    };
  }
}
