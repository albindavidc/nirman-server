import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllPhaseApprovalsQuery } from '../../../queries/phase-approval/get-all-phase-approvals.query';
import { PhaseApprovalResponseDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import {
  IPhaseApprovalQueryReader,
  PHASE_APPROVAL_QUERY_READER,
} from '../../../../domain/repositories/project-phase/phase-approval-repository.interface';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';

@QueryHandler(GetAllPhaseApprovalsQuery)
export class GetAllPhaseApprovalsHandler implements IQueryHandler<GetAllPhaseApprovalsQuery> {
  constructor(
    @Inject(PHASE_APPROVAL_QUERY_READER)
    private readonly phaseApprovalRepository: IPhaseApprovalQueryReader,
  ) {}

  async execute(): Promise<PhaseApprovalResponseDto[]> {
    const approvals = await this.phaseApprovalRepository.findAll();
    return approvals.map(PhaseApprovalMapper.toDtoFromResult);
  }
}
