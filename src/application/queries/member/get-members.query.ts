import { Query } from '@nestjs/cqrs';

export class GetMembersQuery extends Query<any> {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly role?: string,
    public readonly search?: string,
  ) {
    super();
  }
}
