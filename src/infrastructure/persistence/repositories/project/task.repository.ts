import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  ITaskRepository,
  Task,
  TaskDependency,
  TASK_REPOSITORY,
} from '../../../../domain/repositories/task-repository.interface';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<Task>): Promise<Task> {
    const created = await this.prisma.task.create({
      data: {
        phase_id: data.phaseId!,
        name: data.name!,
        description: data.description,
        assigned_to: data.assignedTo,
        planned_start_date: data.plannedStartDate,
        planned_end_date: data.plannedEndDate,
        priority: data.priority,
        status: data.status,
      },
      include: { assignee: true },
    });
    return this.mapTaskToDomain(created);
  }

  async update(id: string, data: Partial<Task>): Promise<Task> {
    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        assigned_to: data.assignedTo,
        planned_start_date: data.plannedStartDate,
        planned_end_date: data.plannedEndDate,
        actual_start_date: data.actualStartDate,
        actual_end_date: data.actualEndDate,
        status: data.status,
        priority: data.priority,
        progress: data.progress,
        notes: data.notes,
      },
      include: { assignee: true },
    });
    return this.mapTaskToDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

  async findById(id: string): Promise<Task | null> {
    const found = await this.prisma.task.findUnique({
      where: { id },
      include: { assignee: true },
    });
    return found ? this.mapTaskToDomain(found) : null;
  }

  async findByPhaseId(phaseId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { phase_id: phaseId },
      include: { assignee: true },
    });
    return tasks.map((t) => this.mapTaskToDomain(t));
  }

  async findByProjectId(projectId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        phase: {
          project_id: projectId,
        },
      },
      include: { assignee: true },
    });
    return tasks.map((t) => this.mapTaskToDomain(t));
  }

  async findByAssigneeId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { assigned_to: userId },
      include: { assignee: true },
    });
    return tasks.map((t) => this.mapTaskToDomain(t));
  }

  async addDependency(data: Partial<TaskDependency>): Promise<TaskDependency> {
    const dep = await this.prisma.taskDependency.create({
      data: {
        phase_id: data.phaseId!,
        successor_task_id: data.successorTaskId!,
        predecessor_task_id: data.predecessorTaskId!,
        type: data.type,
        lag_time: data.lagTime,
        notes: data.notes,
      },
    });
    return this.mapDependencyToDomain(dep);
  }

  async removeDependency(id: string): Promise<void> {
    await this.prisma.taskDependency.delete({ where: { id } });
  }

  async findDependenciesByPhaseId(phaseId: string): Promise<TaskDependency[]> {
    const deps = await this.prisma.taskDependency.findMany({
      where: { phase_id: phaseId },
    });
    return deps.map((d) => this.mapDependencyToDomain(d));
  }

  async findDependenciesByProjectId(
    projectId: string,
  ): Promise<TaskDependency[]> {
    const phases = await this.prisma.projectPhase.findMany({
      where: { project_id: projectId },
      select: { id: true },
    });
    const phaseIds = phases.map((p) => p.id);

    const deps = await this.prisma.taskDependency.findMany({
      where: {
        phase_id: { in: phaseIds },
      },
    });
    return deps.map((d) => this.mapDependencyToDomain(d));
  }

  private mapTaskToDomain(prismaTask: any): Task {
    return {
      id: prismaTask.id,
      phaseId: prismaTask.phase_id,
      assignedTo: prismaTask.assigned_to,
      name: prismaTask.name,
      description: prismaTask.description,
      plannedStartDate: prismaTask.planned_start_date,
      plannedEndDate: prismaTask.planned_end_date,
      actualStartDate: prismaTask.actual_start_date,
      actualEndDate: prismaTask.actual_end_date,
      status: prismaTask.status,
      priority: prismaTask.priority,
      progress: prismaTask.progress,
      notes: prismaTask.notes,
      createdAt: prismaTask.created_at,
      updatedAt: prismaTask.updated_at,
      assignee: prismaTask.assignee
        ? {
            firstName: prismaTask.assignee.first_name,
            lastName: prismaTask.assignee.last_name,
            email: prismaTask.assignee.email,
          }
        : null,
    };
  }

  private mapDependencyToDomain(prismaDep: any): TaskDependency {
    return {
      id: prismaDep.id,
      phaseId: prismaDep.phase_id,
      successorTaskId: prismaDep.successor_task_id,
      predecessorTaskId: prismaDep.predecessor_task_id,
      type: prismaDep.type,
      lagTime: prismaDep.lag_time,
      notes: prismaDep.notes,
    };
  }
}
