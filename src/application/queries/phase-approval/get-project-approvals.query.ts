import { Query } from '@nestjs/cqrs';
import { PhaseApprovalResponseDto } from '../../dto/phase-approval/phase-approval-response.dto';

export class GetProjectApprovalsQuery extends Query<PhaseApprovalResponseDto[]> {
  constructor(public readonly projectId: string) {
    super();
  }
}
