import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RequestPhaseApprovalCommand } from '../../../commands/phase-approval/request-phase-approval.command';
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
import { BadRequestException, NotFoundException } from '@nestjs/common';

@CommandHandler(RequestPhaseApprovalCommand)
export class RequestPhaseApprovalHandler implements ICommandHandler<RequestPhaseApprovalCommand> {
  constructor(
    @Inject(PHASE_APPROVAL_REPOSITORY)
    private readonly phaseApprovalRepository: IPhaseApprovalRepository,
    @Inject(PROJECT_PHASE_REPOSITORY)
    private readonly projectPhaseRepository: IProjectPhaseRepository,
  ) {}

  async execute(
    command: RequestPhaseApprovalCommand,
  ): Promise<PhaseApprovalResponseDto> {
    // 1. Validate Phase
    const phase = await this.projectPhaseRepository.findById(command.phaseId);
    if (!phase) {
      throw new NotFoundException('Project phase not found');
    }

    // 2. Validate Status (Optional: Prevent duplicate requests)
    // Assuming 'Review Pending' or 'Completed' should block new requests
    if (phase.status === 'Completed') {
      throw new BadRequestException('Phase is already completed');
    }
    if (phase.status === 'Review Pending') {
      throw new BadRequestException('Approval already requested');
    }

    // 3. Create Approval Request
    const approval = await this.phaseApprovalRepository.create({
      phaseId: command.phaseId,
      requestedBy: command.requestedBy,
      approvalStatus: 'pending',
      comments: command.comments,
      media: command.media,
      approvedBy: command.approverId || undefined,
    });

    // 4. Update Phase Status
    await this.projectPhaseRepository.updateStatus(
      command.phaseId,
      'Review Pending',
    );

    return PhaseApprovalMapper.toDtoFromResult(approval);
  }
}
