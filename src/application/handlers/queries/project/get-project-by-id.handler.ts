import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProjectByIdQuery } from '../../../queries/project/get-project-by-id.query';
import {
  IProjectRepository,
  PROJECT_REPOSITORY,
} from '../../../../domain/repositories/project-repository.interface';
import { ProjectMapper } from '../../../mappers/project.mapper';
import { ProjectResponseDto } from '../../../dto/project/project-response.dto';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler implements IQueryHandler<GetProjectByIdQuery> {
  constructor(
    @Inject(PROJECT_REPOSITORY)
    private readonly projectRepository: IProjectRepository,
  ) {}

  async execute(
    query: GetProjectByIdQuery,
  ): Promise<ProjectResponseDto | null> {
    const { projectId } = query;

    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return ProjectMapper.toResponse(project);
  }
}
