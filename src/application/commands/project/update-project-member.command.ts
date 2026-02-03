export class UpdateProjectMemberCommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly role: string,
  ) {}
}
