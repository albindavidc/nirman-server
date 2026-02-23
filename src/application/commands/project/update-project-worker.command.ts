export class UpdateProjectWorkerCommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly role: string,
  ) {}
}
