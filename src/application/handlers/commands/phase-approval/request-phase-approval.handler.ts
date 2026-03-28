import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { RequestPhaseApprovalCommand } from '../../../commands/phase-approval/request-phase-approval.command';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';
import { PhaseApprovalResponseDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import {
  IPhaseApprovalWriter,
  PHASE_APPROVAL_WRITER,
} from '../../../../domain/repositories/project-phase/phase-approval-repository.interface';
import { IProjectPhaseReader } from '../../../../domain/repositories/project-phase/project-phase.reader.interface';
import { PROJECT_PHASE_QUERY_REPOSITORY } from '../../../../domain/repositories/project-phase/project-phase.query-reader.interface';
import { PROJECT_PHASE_REPOSITORY } from '../../../../domain/repositories/project-phase/project-phase-repository.interface';
import { IProjectPhaseWriter } from '../../../../domain/repositories/project-phase/project-phase.writer.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApprovalStatus } from '../../../../domain/enums/approval-status.enum';

@CommandHandler(RequestPhaseApprovalCommand)
export class RequestPhaseApprovalHandler implements ICommandHandler<RequestPhaseApprovalCommand> {
  constructor(
    @Inject(PHASE_APPROVAL_WRITER)
    private readonly phaseApprovalWriter: IPhaseApprovalWriter,
    @Inject(PROJECT_PHASE_QUERY_REPOSITORY)
    private readonly projectPhaseReader: IProjectPhaseReader,
    @Inject(PROJECT_PHASE_REPOSITORY)
    private readonly projectPhaseWriter: IProjectPhaseWriter,
  ) {}

  async execute(
    command: RequestPhaseApprovalCommand,
  ): Promise<PhaseApprovalResponseDto> {
    // 1. Validate Phase
    const phase = await this.projectPhaseReader.findById(command.phaseId);
    if (!phase) {
      throw new NotFoundException('Project phase not found');
    }

    // 2. Validate Status (Optional: Prevent duplicate requests)
    // Assuming 'Review Pending' or 'Completed' should block new requests
    if (phase.status === 'Completed') {
      throw new BadRequestException('Phase is already completed');
    }
    if (phase.status === 'In Progress') {
      throw new BadRequestException('Phase is already in progress');
    }
    if (phase.status === 'Review Pending') {
      throw new BadRequestException('Approval already requested');
    }

    // 3. Create Approval Request
    const approval = await this.phaseApprovalWriter.create({
      phaseId: command.phaseId,
      requestedBy: command.requestedBy,
      approvalStatus: ApprovalStatus.PENDING,
      comments: command.comments,
      media: command.media,
      approvedBy: command.approverId || undefined,
    });

    // 4. Update Phase Status
    phase.updateStatus('Review Pending');
    await this.projectPhaseWriter.save(phase);

    return PhaseApprovalMapper.toDtoFromResult(approval);
  }
}
