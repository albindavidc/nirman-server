export interface TeamMemberDto {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
}

export interface ProjectResponseDto {
  id: string;
  name: string;
  description?: string;
  icon: string;
  status: string;
  progress: number;
  budget?: number;
  spent?: number;
  startDate?: string;
  dueDate?: string;
  teamMembers: TeamMemberDto[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
