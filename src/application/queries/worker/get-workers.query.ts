import { Query } from '@nestjs/cqrs';
import { WorkerListResponseDto } from '../../dto/worker/worker-response.dto';

export class GetWorkersQuery extends Query<WorkerListResponseDto> {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly role?: string,
    public readonly search?: string,
  ) {
    super();
  }
}
