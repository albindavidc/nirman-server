export class UpdateWorkerGroupCommand {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly trade: string,
    public readonly projectId: string,
    public readonly updatedById: string,
    public readonly isActive: boolean,
  ) {}
}
