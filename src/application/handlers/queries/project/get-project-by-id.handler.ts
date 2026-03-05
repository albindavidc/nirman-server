import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { GetProjectByIdQuery } from '../../../queries/project/get-project-by-id.query';
import {
  IProjectReader,
  PROJECT_READER,
} from '../../../../domain/repositories/project/project.reader.interface';
import { ProjectMapper } from '../../../mappers/project.mapper';
import { ProjectResponseDto } from '../../../dto/project/project-response.dto';

@QueryHandler(GetProjectByIdQuery)
export class GetProjectByIdHandler implements IQueryHandler<GetProjectByIdQuery> {
  constructor(
    @Inject(PROJECT_READER)
    private readonly projectReader: IProjectReader,
  ) {}

  async execute(
    query: GetProjectByIdQuery,
  ): Promise<ProjectResponseDto | null> {
    const { projectId } = query;

    const project = await this.projectReader.findById(projectId);
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return ProjectMapper.toResponse(project);
  }
}
