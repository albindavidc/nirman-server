export class GetMembersQuery {
  constructor(
    public readonly role?: string,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
