export class GetMembersQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly role?: string,
    public readonly search?: string,
  ) {}
}
