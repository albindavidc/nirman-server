import { Command } from '@nestjs/cqrs';
import { ApprovalStatus } from '../../../domain/enums/approval-status.enum';
import { PhaseApprovalResponseDto } from '../../dto/phase-approval/phase-approval-response.dto';

export class CreatePhaseApprovalCommand extends Command<PhaseApprovalResponseDto> {
  constructor(
    public readonly phaseId: string,
    public readonly approvedBy: string,
    public readonly requestedBy: string,
    public readonly approvalStatus: ApprovalStatus,
    public readonly comments: string | null,
    public readonly media: { type: string; url: string }[],
  ) {
    super();
  }
}
