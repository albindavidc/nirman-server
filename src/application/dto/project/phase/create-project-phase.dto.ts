export interface CreateProjectPhaseDto {
  projectId: string;
  name: string;
  description?: string;
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  sequence: number;
}
