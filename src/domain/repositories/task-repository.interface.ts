export interface Task {
  id: string;
  phaseId: string;
  assignedTo: string | null;
  name: string;
  description: string | null;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  actualStartDate: Date | null;
  actualEndDate: Date | null;
  status: string;
  priority: string;
  progress: number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  assignee?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface TaskDependency {
  id: string;
  phaseId: string;
  successorTaskId: string;
  predecessorTaskId: string;
  type: string;
  lagTime: number;
  notes: string | null;
}

export interface ITaskRepository {
  create(data: Partial<Task>): Promise<Task>;
  update(id: string, data: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Task | null>;
  findByPhaseId(phaseId: string): Promise<Task[]>;
  findByProjectId(projectId: string): Promise<Task[]>;
  findByAssigneeId(userId: string): Promise<Task[]>;
  addDependency(data: Partial<TaskDependency>): Promise<TaskDependency>;
  removeDependency(id: string): Promise<void>;
  findDependenciesByPhaseId(phaseId: string): Promise<TaskDependency[]>;
  findDependenciesByProjectId(projectId: string): Promise<TaskDependency[]>;
}

export const TASK_REPOSITORY = Symbol('TASK_REPOSITORY');
