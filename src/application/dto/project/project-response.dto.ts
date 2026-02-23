export interface TeamMemberDto {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface ProjectWorkerResponseDto {
  userId: string;
  role: string;
  joinedAt: string;
  isCreator: boolean;
}

export interface ProjectPhaseDto {
  name: string;
  status: string;
  progress: number;
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
}

export interface ProjectResponseDto {
  id: string;
  name: string;
  managerIds: string[];
  description?: string;
  icon: string;
  status: string;
  progress: number;
  budget?: number;
  spent?: number;
  startDate?: string;
  dueDate?: string;
  latitude?: number;
  longitude?: number;
  phases: ProjectPhaseDto[];
  workers: ProjectWorkerResponseDto[];
  teamMembers: TeamMemberDto[];
  createdAt: string;
  updatedAt: string;
}
