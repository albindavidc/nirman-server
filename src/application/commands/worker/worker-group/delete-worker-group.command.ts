export class DeleteWorkerGroupCommand {
  constructor(
    public readonly id: string,
    public readonly projectId: string,
    public readonly deletedById: string,
  ) {}
}
