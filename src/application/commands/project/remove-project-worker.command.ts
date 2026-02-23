export class RemoveProjectWorkerCommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
  ) {}
}
