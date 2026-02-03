export class GetProfessionalsQuery {
  constructor(
    public readonly search?: string,
    public readonly excludeProjectId?: string,
  ) {}
}
