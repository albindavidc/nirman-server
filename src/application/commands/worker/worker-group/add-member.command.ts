export class AddMemberCommand {
  constructor(
    public readonly groupId: string,
    public readonly workerId: string,
    public readonly userId: string,
  ) {}
}