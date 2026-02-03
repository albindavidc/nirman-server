import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreatePhaseApprovalCommand } from '../../../commands/phase-approval/create-phase-approval.command';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';
import { PhaseApprovalResponseDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import {
  IPhaseApprovalRepository,
  PHASE_APPROVAL_REPOSITORY,
} from '../../../../domain/repositories/phase-approval-repository.interface';
import {
  IProjectPhaseRepository,
  PROJECT_PHASE_REPOSITORY,
} from '../../../../domain/repositories/project-phase-repository.interface';

@CommandHandler(CreatePhaseApprovalCommand)
export class CreatePhaseApprovalHandler implements ICommandHandler<CreatePhaseApprovalCommand> {
  constructor(
    @Inject(PHASE_APPROVAL_REPOSITORY)
    private readonly phaseApprovalRepository: IPhaseApprovalRepository,
    @Inject(PROJECT_PHASE_REPOSITORY)
    private readonly projectPhaseRepository: IProjectPhaseRepository,
  ) {}

  async execute(
    command: CreatePhaseApprovalCommand,
  ): Promise<PhaseApprovalResponseDto> {
    // Create the approval record
    const approval = await this.phaseApprovalRepository.create({
      phaseId: command.phaseId,
      approvedBy: command.approvedBy,
      requestedBy: command.requestedBy,
      approvalStatus: command.approvalStatus,
      comments: command.comments,
      media: command.media,
    });

    // Update phase status based on approval
    if (command.approvalStatus === 'approved') {
      await this.projectPhaseRepository.updateStatus(
        command.phaseId,
        'Completed',
      );
    } else if (command.approvalStatus === 'rejected') {
      await this.projectPhaseRepository.updateStatus(
        command.phaseId,
        'Rejected',
      );
    }

    return PhaseApprovalMapper.toDtoFromResult(approval);
  }
}
