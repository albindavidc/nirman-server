import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionalsQuery } from '../../../queries/project/get-professionals.query';
import {
  IProfessionalRepository,
  PROFESSIONAL_REPOSITORY,
  ProfessionalWithUser,
} from '../../../../domain/repositories/professional-repository.interface';
import {
  IProjectMemberRepository,
  PROJECT_MEMBER_REPOSITORY,
} from '../../../../domain/repositories/project-member-repository.interface';

@QueryHandler(GetProfessionalsQuery)
export class GetProfessionalsHandler implements IQueryHandler<GetProfessionalsQuery> {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
    @Inject(PROJECT_MEMBER_REPOSITORY)
    private readonly projectMemberRepository: IProjectMemberRepository,
  ) {}

  async execute(query: GetProfessionalsQuery): Promise<ProfessionalWithUser[]> {
    const { search, excludeProjectId } = query;

    // Get existing project member IDs if excluding
    let excludeUserIds: string[] = [];
    if (excludeProjectId) {
      excludeUserIds =
        await this.projectMemberRepository.getMemberIds(excludeProjectId);
    }

    return this.professionalRepository.findAllWithFilters({
      search,
      excludeUserIds: excludeUserIds.length > 0 ? excludeUserIds : undefined,
      limit: 50,
    });
  }
}
