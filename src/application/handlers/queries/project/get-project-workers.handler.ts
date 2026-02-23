import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectWorkersQuery } from '../../../queries/project/get-project-workers.query';
import {
  IProjectWorkerRepository,
  PROJECT_WORKER_REPOSITORY,
  ProjectWorkerWithUser,
} from '../../../../domain/repositories/project-worker-repository.interface';

@QueryHandler(GetProjectWorkersQuery)
export class GetProjectWorkersHandler implements IQueryHandler<GetProjectWorkersQuery> {
  constructor(
    @Inject(PROJECT_WORKER_REPOSITORY)
    private readonly projectWorkerRepository: IProjectWorkerRepository,
  ) {}

  async execute(query: GetProjectWorkersQuery): Promise<
    Array<{
      userId: string;
      role: string;
      joinedAt: Date;
      isCreator: boolean;
      user: {
        id: string;
        fullName: string;
        email: string;
        profilePhoto: string | null;
        title: string;
      } | null;
    }>
  > {
    const { projectId } = query;

    const workers =
      await this.projectWorkerRepository.findByProjectId(projectId);

    return workers.map((worker: ProjectWorkerWithUser) => ({
      userId: worker.userId,
      role: worker.role,
      joinedAt: worker.joinedAt,
      isCreator: worker.isCreator,
      user: worker.user,
    }));
  }
}
