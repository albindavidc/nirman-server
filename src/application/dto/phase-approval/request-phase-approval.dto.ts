export interface RequestPhaseApprovalDto {
  comments?: string;
  media?: { type: string; url: string }[];
  approverId?: string;
}
