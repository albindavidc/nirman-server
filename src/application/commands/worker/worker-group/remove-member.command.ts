export class RemoveMemberCommand {
  constructor(
    public readonly groupId: string,
    public readonly workerId: string,
    public readonly projectId: string,
    public readonly removedById: string,
  ) {}
}
