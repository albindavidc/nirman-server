import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetWorkersQuery } from '../../../queries/worker/get-workers.query';
import { WorkerListResponseDto } from '../../../dto/worker/worker-response.dto';
import {
  IWorkerRepository,
  WORKER_REPOSITORY,
} from '../../../../domain/repositories/worker-repository.interface';

@QueryHandler(GetWorkersQuery)
export class GetWorkersHandler implements IQueryHandler<GetWorkersQuery> {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async execute(query: GetWorkersQuery): Promise<WorkerListResponseDto> {
    const { page, limit, role, search } = query;

    const { workers, total } = await this.workerRepository.findAllWithFilters({
      page,
      limit,
      role: role as any, // Cast string to UserRole enum
      search,
    });

    return {
      data: workers.map((worker) => ({
        id: worker.id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        email: worker.email,
        phoneNumber: worker.phoneNumber ?? undefined,
        role: worker.role,
        userStatus: worker.userStatus,
        professionalTitle: worker.professional?.professionalTitle,
        experienceYears: worker.professional?.experienceYears,
        skills: worker.professional?.skills,
        addressStreet: worker.professional?.addressStreet,
        addressCity: worker.professional?.addressCity,
        addressState: worker.professional?.addressState,
        addressZipCode: worker.professional?.addressZipCode,
        createdAt: worker.createdAt,
        updatedAt: worker.updatedAt,
      })),
      total,
      page,
      limit,
    };
  }
}
