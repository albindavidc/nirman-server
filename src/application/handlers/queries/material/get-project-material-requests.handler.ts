import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MaterialRequestRepository } from '../../../../infrastructure/persistence/repositories/material/material-request.repository';
import { MaterialRequestDto } from '../../../dto/material/request.dto';
import { MaterialRequestMapper } from '../../../mappers/material-request.mapper';

import { GetProjectMaterialRequestsQuery } from '../../../queries/material/get-project-material-requests.query';

@QueryHandler(GetProjectMaterialRequestsQuery)
export class GetProjectMaterialRequestsHandler implements IQueryHandler<GetProjectMaterialRequestsQuery> {
  constructor(private readonly repository: MaterialRequestRepository) {}

  async execute(
    query: GetProjectMaterialRequestsQuery,
  ): Promise<MaterialRequestDto[]> {
    const requests = await this.repository.findByProjectId(query.projectId);
    return requests.map((request) => MaterialRequestMapper.toDto(request));
  }
}
