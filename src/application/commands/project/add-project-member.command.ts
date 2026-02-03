export class AddProjectMemberCommand {
  constructor(
    public readonly projectId: string,
    public readonly userIds: string[],
    public readonly role: string,
  ) {}
}
