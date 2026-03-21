import { Command } from '@nestjs/cqrs';
import { PhaseApprovalResponseDto } from '../../dto/phase-approval/phase-approval-response.dto';

export class RequestPhaseApprovalCommand extends Command<PhaseApprovalResponseDto> {
  constructor(
    public readonly phaseId: string,
    public readonly requestedBy: string,
    public readonly comments: string | null,
    public readonly media: { type: string; url: string }[],
    public readonly approverId?: string,
  ) {
    super();
  }
}
