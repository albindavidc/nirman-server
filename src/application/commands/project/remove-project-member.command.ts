export class RemoveProjectMemberCommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
  ) {}
}
