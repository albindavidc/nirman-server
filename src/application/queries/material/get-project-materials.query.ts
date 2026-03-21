import { Query } from '@nestjs/cqrs';
import { MaterialDto } from '../../dto/material/material.dto';

export class GetProjectMaterialsQuery extends Query<MaterialDto[]> {
  constructor(public readonly projectId: string) {
    super();
  }
}
