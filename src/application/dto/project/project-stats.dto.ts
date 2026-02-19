export class ProjectStatsDto {
  total: number;
  active: number;
  completed: number;
  paused: number;
  totalBudget: number;
  totalSpent: number;

  constructor(partial: Partial<ProjectStatsDto>) {
    this.total = partial.total ?? 0;
    this.active = partial.active ?? 0;
    this.completed = partial.completed ?? 0;
    this.paused = partial.paused ?? 0;
    this.totalBudget = partial.totalBudget ?? 0;
    this.totalSpent = partial.totalSpent ?? 0;
  }
}
