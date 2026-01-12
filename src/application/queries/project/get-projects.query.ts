export class GetProjectsQuery {
  constructor(
    public readonly status?: string,
    public readonly search?: string,
    public readonly page: number = 1,
    public readonly limit: number = 10,
  ) {}
}
