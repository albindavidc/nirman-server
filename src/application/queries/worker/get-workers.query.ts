export class GetWorkersQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly role?: string,
    public readonly search?: string,
  ) {}
}
