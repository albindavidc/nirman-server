export type RepoUser = {
  first_name: string;
  last_name: string;
  email: string;
};

export type TaskRecord = {
  id: string;
  phase_id: string;
  assigned_to: string | null;
  name: string;
  description: string | null;
  planned_start_date: Date | null;
  planned_end_date: Date | null;
  actual_start_date: Date | null;
  actual_end_date: Date | null;
  status: string;
  priority: string;
  progress: number;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
  assignee: RepoUser | null;
};

export type TaskDependencyRecord = {
  id: string;
  phase_id: string;
  successor_task_id: string;
  predecessor_task_id: string;
  type: string;
  lag_time: number;
  notes: string | null;
};
