import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CreatePhaseApprovalCommand } from '../../../commands/phase-approval/create-phase-approval.command';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';
import { PhaseApprovalResponseDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import {
  IPhaseApprovalReader,
  IPhaseApprovalWriter,
  PHASE_APPROVAL_READER,
  PHASE_APPROVAL_WRITER,
} from '../../../../domain/repositories/project-phase/phase-approval-repository.interface';
import { PROJECT_PHASE_REPOSITORY } from '../../../../domain/repositories/project-phase/project-phase-repository.interface';
import { IProjectPhaseWriter } from '../../../../domain/repositories/project-phase/project-phase.writer.interface';
import { PROJECT_PHASE_QUERY_REPOSITORY } from '../../../../domain/repositories/project-phase/project-phase.query-reader.interface';
import { IProjectPhaseReader } from '../../../../domain/repositories/project-phase/project-phase.reader.interface';
import { ApprovalStatus } from '../../../../domain/enums/approval-status.enum';

@CommandHandler(CreatePhaseApprovalCommand)
export class CreatePhaseApprovalHandler implements ICommandHandler<CreatePhaseApprovalCommand> {
  constructor(
    @Inject(PHASE_APPROVAL_READER)
    private readonly phaseApprovalReader: IPhaseApprovalReader,
    @Inject(PHASE_APPROVAL_WRITER)
    private readonly phaseApprovalWriter: IPhaseApprovalWriter,
    @Inject(PROJECT_PHASE_QUERY_REPOSITORY)
    private readonly projectPhaseReader: IProjectPhaseReader,
    @Inject(PROJECT_PHASE_REPOSITORY)
    private readonly projectPhaseWriter: IProjectPhaseWriter,
  ) {}

  async execute(
    command: CreatePhaseApprovalCommand,
  ): Promise<PhaseApprovalResponseDto> {
    // 1. Validate phase exists
    const phase = await this.projectPhaseReader.findById(command.phaseId);
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
    const latestApproval = await this.phaseApprovalReader.findLatestByPhaseId(
      command.phaseId,
    );
    if (
      latestApproval &&
      latestApproval.approvalStatus !== ApprovalStatus.PENDING
    ) {
      throw new BadRequestException(
        `Phase approval has already been ${latestApproval.approvalStatus}`,
      );
    }

    // 4. Create the approval record
    const approval = await this.phaseApprovalWriter.create({
      phaseId: command.phaseId,
      approvedBy: command.approvedBy,
      requestedBy: command.requestedBy,
      approvalStatus: command.approvalStatus,
      comments: command.comments,
      media: command.media,
    });

    // 5. Update phase status and related fields based on decision
    if (command.approvalStatus === ApprovalStatus.APPROVED) {
      phase.updateStatus('Completed');
      phase.updateProgress(100);
      phase.updateActualDates(phase.actualStartDate, new Date());
      await this.projectPhaseWriter.save(phase);
    } else if (command.approvalStatus === ApprovalStatus.REJECTED) {
      phase.updateStatus('In Progress');
      await this.projectPhaseWriter.save(phase);
    }

    return PhaseApprovalMapper.toDtoFromResult(approval);
  }
}
