import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProfessionalsQuery } from '../../../queries/project/get-professionals.query';
import {
  IProfessionalRepository,
  PROFESSIONAL_REPOSITORY,
  ProfessionalWithUser,
} from '../../../../domain/repositories/professional-repository.interface';
import {
  IProjectWorkerRepository,
  PROJECT_WORKER_REPOSITORY,
} from '../../../../domain/repositories/project/project-worker-repository.interface';

@QueryHandler(GetProfessionalsQuery)
export class GetProfessionalsHandler implements IQueryHandler<GetProfessionalsQuery> {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
    @Inject(PROJECT_WORKER_REPOSITORY)
    private readonly projectWorkerRepository: IProjectWorkerRepository,
  ) {}

  async execute(query: GetProfessionalsQuery): Promise<ProfessionalWithUser[]> {
    const { search, excludeProjectId } = query;

    // Get existing project worker IDs if excluding
    let excludeUserIds: string[] = [];
    if (excludeProjectId) {
      excludeUserIds =
        await this.projectWorkerRepository.getWorkerIds(excludeProjectId);
    }

    return this.professionalRepository.findAllWithFilters({
      search,
      excludeUserIds: excludeUserIds.length > 0 ? excludeUserIds : undefined,
      limit: 50,
    });
  }
}
