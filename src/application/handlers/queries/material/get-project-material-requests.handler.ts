import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { MaterialRequestDto } from '../../../dto/material/request.dto';
import { MaterialRequestMapper } from '../../../mappers/material-request.mapper';
import { GetProjectMaterialRequestsQuery } from '../../../queries/material/get-project-material-requests.query';
import {
  IMaterialRequestQueryReader,
  MATERIAL_REQUEST_QUERY_READER,
} from '../../../../domain/repositories/project-material/material-request.query-reader.interface';

@QueryHandler(GetProjectMaterialRequestsQuery)
export class GetProjectMaterialRequestsHandler implements IQueryHandler<GetProjectMaterialRequestsQuery> {
  constructor(
    /**
     * DIP — injects only the query-reader interface via Symbol token.
     * Query handlers must never see write operations.
     */
    @Inject(MATERIAL_REQUEST_QUERY_READER)
    private readonly queryReader: IMaterialRequestQueryReader,
  ) {}

  async execute(
    query: GetProjectMaterialRequestsQuery,
  ): Promise<MaterialRequestDto[]> {
    const requests = await this.queryReader.findByProjectId(query.projectId);
    return requests.map(
      (
        request: import('../../../../domain/entities/material-request.entity').MaterialRequest,
      ) => MaterialRequestMapper.toDto(request),
    );
  }
}
