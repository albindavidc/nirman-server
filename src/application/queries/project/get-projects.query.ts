import { Query } from '@nestjs/cqrs';
import { ProjectResponseDto } from '../../dto/project/project-response.dto';

export class GetProjectsQuery extends Query<{
  data: ProjectResponseDto[];
  total: number;
  page: number;
  limit: number;
}> {
  constructor(
    public readonly status?: string,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {
    super();
  }
}
