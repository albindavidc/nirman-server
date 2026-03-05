import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectApprovalsQuery } from '../../../queries/phase-approval/get-project-approvals.query';
import { PhaseApprovalResponseDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';
import {
  IPhaseApprovalQueryReader,
  PHASE_APPROVAL_QUERY_READER,
} from '../../../../domain/repositories/project-phase/phase-approval-repository.interface';

@QueryHandler(GetProjectApprovalsQuery)
export class GetProjectApprovalsHandler implements IQueryHandler<GetProjectApprovalsQuery> {
  constructor(
    @Inject(PHASE_APPROVAL_QUERY_READER)
    private readonly phaseApprovalRepository: IPhaseApprovalQueryReader,
  ) {}

  async execute(
    query: GetProjectApprovalsQuery,
  ): Promise<PhaseApprovalResponseDto[]> {
    const approvals = await this.phaseApprovalRepository.findByProjectId(
      query.projectId,
    );
    return approvals.map((approval) =>
      PhaseApprovalMapper.toDtoFromResult(approval),
    );
  }
}
