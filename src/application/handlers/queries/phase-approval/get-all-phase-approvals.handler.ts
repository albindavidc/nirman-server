import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllPhaseApprovalsQuery } from '../../../queries/phase-approval/get-all-phase-approvals.query';
import { PhaseApprovalResponseDto } from '../../../dto/phase-approval/phase-approval-response.dto';
import {
  IPhaseApprovalRepository,
  PHASE_APPROVAL_REPOSITORY,
} from '../../../../domain/repositories/phase-approval-repository.interface';
import { PhaseApprovalMapper } from '../../../mappers/phase-approval.mapper';

@QueryHandler(GetAllPhaseApprovalsQuery)
export class GetAllPhaseApprovalsHandler implements IQueryHandler<GetAllPhaseApprovalsQuery> {
  constructor(
    @Inject(PHASE_APPROVAL_REPOSITORY)
    private readonly phaseApprovalRepository: IPhaseApprovalRepository,
  ) {}

  async execute(): Promise<PhaseApprovalResponseDto[]> {
    const approvals = await this.phaseApprovalRepository.findAll();
    return approvals.map(PhaseApprovalMapper.toDtoFromResult);
  }
}
