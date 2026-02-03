import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectApprovalsQuery } from '../../../queries/phase-approval/get-project-approvals.query';
import { PhaseApprovalResponseDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';
import {
  IPhaseApprovalRepository,
  PHASE_APPROVAL_REPOSITORY,
} from '../../../../domain/repositories/phase-approval-repository.interface';

@QueryHandler(GetProjectApprovalsQuery)
export class GetProjectApprovalsHandler implements IQueryHandler<GetProjectApprovalsQuery> {
  constructor(
    @Inject(PHASE_APPROVAL_REPOSITORY)
    private readonly phaseApprovalRepository: IPhaseApprovalRepository,
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
