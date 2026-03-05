import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetProjectsQuery } from '../../../queries/project/get-projects.query';
import {
  IProjectQueryReader,
  PROJECT_QUERY_READER,
} from '../../../../domain/repositories/project/project.query-reader.interface';
import { ProjectMapper } from '../../../mappers/project.mapper';
import { ProjectResponseDto } from '../../../dto/project/project-response.dto';

@QueryHandler(GetProjectsQuery)
export class GetProjectsHandler implements IQueryHandler<GetProjectsQuery> {
  constructor(
    @Inject(PROJECT_QUERY_READER)
    private readonly projectQueryReader: IProjectQueryReader,
  ) {}

  async execute(query: GetProjectsQuery): Promise<{
    data: ProjectResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { status, search, page, limit } = query;

    const { projects, total } =
      await this.projectQueryReader.findAllWithFilters({
        status,
        search,
        page,
        limit,
      });

    return {
      data: projects.map((p) => ProjectMapper.toResponse(p)),
      total,
      page,
      limit,
    };
  }
}
