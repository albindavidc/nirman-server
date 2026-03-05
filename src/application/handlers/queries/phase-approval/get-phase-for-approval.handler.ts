import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetPhaseForApprovalQuery } from '../../../queries/phase-approval/get-phase-for-approval.query';
import { PhaseForApprovalDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';
import {
  IProjectPhaseQueryReader,
  PROJECT_PHASE_QUERY_REPOSITORY,
} from '../../../../domain/repositories/project-phase/project-phase.query-reader.interface';

@QueryHandler(GetPhaseForApprovalQuery)
export class GetPhaseForApprovalHandler implements IQueryHandler<GetPhaseForApprovalQuery> {
  constructor(
    @Inject(PROJECT_PHASE_QUERY_REPOSITORY)
    private readonly projectPhaseQueryReader: IProjectPhaseQueryReader,
  ) {}

  async execute(query: GetPhaseForApprovalQuery): Promise<PhaseForApprovalDto> {
    const phaseData = await this.projectPhaseQueryReader.findWithApprovals(
      query.phaseId,
    );

    if (!phaseData) {
      throw new NotFoundException('Phase not found');
    }

    return {
      phase: {
        id: phaseData.phase.id,
        name: phaseData.phase.name,
        description: phaseData.phase.description,
        progress: phaseData.phase.progress,
        plannedStartDate:
          phaseData.phase.plannedStartDate?.toISOString() ?? null,
        plannedEndDate: phaseData.phase.plannedEndDate?.toISOString() ?? null,
        actualStartDate: phaseData.phase.actualStartDate?.toISOString() ?? null,
        actualEndDate: phaseData.phase.actualEndDate?.toISOString() ?? null,
        status: phaseData.phase.status,
        sequence: phaseData.phase.sequence,
      },
      project: {
        id: phaseData.project.id,
        name: phaseData.project.name,
        budget: phaseData.project.budget,
        spent: phaseData.project.spent,
      },
      approvals: phaseData.approvals.map((a) =>
        PhaseApprovalMapper.toDtoFromApproval(a),
      ),
      taskStats: phaseData.taskStats,
    };
  }
}
