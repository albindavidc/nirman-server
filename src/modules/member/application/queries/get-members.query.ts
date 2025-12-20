import { Query } from '@nestjs/cqrs';
import { PaginatedMembersResponseDto } from '../dto/paginated-members-response.dto';

export class GetMembersQuery extends Query<PaginatedMembersResponseDto> {
  constructor(
    public readonly role?: string,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {
    super();
  }
}
