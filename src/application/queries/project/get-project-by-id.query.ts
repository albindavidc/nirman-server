import { Query } from '@nestjs/cqrs';
import { ProjectResponseDto } from '../../dto/project/project-response.dto';

export class GetProjectByIdQuery extends Query<ProjectResponseDto | null> {
  constructor(public readonly projectId: string) {
    super();
  }
}
