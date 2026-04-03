export class GetWorkerGroupByIdQuery {
  constructor(
    public readonly id: string,
    public readonly withMembers: boolean = false,
  ) {}
}
