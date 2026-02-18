export interface MediaItemResponse {
  type: string;
  url: string;
}

export interface PhaseApprovalResponseDto {
  id: string;
  phaseId: string;
  projectId?: string;
  projectName?: string;
  approvedBy: string | null;
  approverName: string | null;
  requestedBy: string;
  requesterName: string;
  approvalStatus: string;
  comments: string | null;
  media: MediaItemResponse[];
  approvedAt: string | null;
  requestedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PhaseForApprovalDto {
  phase: {
    id: string;
    name: string;
    description: string | null;
    progress: number;
    plannedStartDate: string | null;
    plannedEndDate: string | null;
    actualStartDate: string | null;
    actualEndDate: string | null;
    status: string;
    sequence: number;
  };
  project: {
    id: string;
    name: string;
    budget: number | null;
    spent: number | null;
  };
  submittedBy?: {
    id: string;
    name: string;
  };
  submittedAt?: string;

  taskStats: {
    total: number;
    completed: number;
  };
  approvals: PhaseApprovalResponseDto[];
}
