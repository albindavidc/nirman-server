import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
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
    // 1. Validate phase exists
    const phase = await this.projectPhaseRepository.findById(command.phaseId);
    if (!phase) {
      throw new NotFoundException('Project phase not found');
    }

    // 2. Guard against duplicate decisions
    if (phase.status === 'Completed') {
      throw new BadRequestException('Phase is already approved and completed');
    }
    if (phase.status === 'Rejected') {
      throw new BadRequestException('Phase has already been rejected');
    }

    // 3. Check if latest approval is already decided
    const latestApproval =
      await this.phaseApprovalRepository.findLatestByPhaseId(command.phaseId);
    if (latestApproval && latestApproval.approvalStatus !== 'pending') {
      throw new BadRequestException(
        `Phase approval has already been ${latestApproval.approvalStatus}`,
      );
    }

    // 4. Create the approval record
    const approval = await this.phaseApprovalRepository.create({
      phaseId: command.phaseId,
      approvedBy: command.approvedBy,
      requestedBy: command.requestedBy,
      approvalStatus: command.approvalStatus,
      comments: command.comments,
      media: command.media,
    });

    // 5. Update phase status and related fields based on decision
    if (command.approvalStatus === 'approved') {
      await this.projectPhaseRepository.update(command.phaseId, {
        status: 'Completed',
        progress: 100,
        actualEndDate: new Date(),
      });
    } else if (command.approvalStatus === 'rejected') {
      await this.projectPhaseRepository.update(command.phaseId, {
        status: 'In Progress',
      });
    }

    return PhaseApprovalMapper.toDtoFromResult(approval);
  }
}
