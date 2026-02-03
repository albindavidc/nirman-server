export interface ProjectPhaseDto {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  progress: number;
  plannedStartDate: Date | null;
  plannedEndDate: Date | null;
  actualStartDate: Date | null;
  actualEndDate: Date | null;
  status: string;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
}
