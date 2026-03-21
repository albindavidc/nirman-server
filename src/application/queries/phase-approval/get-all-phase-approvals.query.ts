import { Query } from '@nestjs/cqrs';
import { PhaseApprovalResponseDto } from '../../dto/phase-approval/phase-approval-response.dto';

export class GetAllPhaseApprovalsQuery extends Query<PhaseApprovalResponseDto[]> {
  constructor() {
    super();
  }
}
