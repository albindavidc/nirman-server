export type RepoUser = {
  firstName: string;
  lastName: string;
  email: string;
};

export type TaskRecord = {
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
  color: string | null;
  notes: string | null;
  estimatedHours: number | null;
  actualHours: number | null;
  createdAt: Date;
  updatedAt: Date;
  assignee: RepoUser | null;
};

export type TaskDependencyRecord = {
  id: string;
  phaseId: string;
  successorTaskId: string;
  predecessorTaskId: string;
  type: string;
  lagTime: number;
  notes: string | null;
};
