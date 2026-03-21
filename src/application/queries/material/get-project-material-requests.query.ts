import { Query } from '@nestjs/cqrs';
import { MaterialRequestDto } from '../../dto/material/request.dto';

export class GetProjectMaterialRequestsQuery extends Query<MaterialRequestDto[]> {
  constructor(public readonly projectId: string) {
    super();
  }
}
