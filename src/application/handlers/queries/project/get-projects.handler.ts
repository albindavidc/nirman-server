import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectsQuery } from '../../../queries/project/get-projects.query';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project-repository.interface';
import { ProjectMapper } from '../../../mappers/project.mapper';
import { ProjectResponseDto } from '../../../dto/project/project-response.dto';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(query: GetProjectsQuery): Promise<{
    data: ProjectResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { status, search, page, limit } = query;

    const { projects, total } = await this.projectRepository.findAllWithFilters(
      {
        status,
        search,
        page,
        limit,
      },
    );

    return {
      data: projects.map((p) => ProjectMapper.toResponse(p)),
      total,
      page,
      limit,
    };
  }
}
