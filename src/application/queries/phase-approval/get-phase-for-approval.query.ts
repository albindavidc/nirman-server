import { Query } from '@nestjs/cqrs';
import { PhaseForApprovalDto } from '../../dto/phase-approval/phase-approval-response.dto';

export class GetPhaseForApprovalQuery extends Query<PhaseForApprovalDto> {
  constructor(public readonly phaseId: string) {
    super();
  }
}
