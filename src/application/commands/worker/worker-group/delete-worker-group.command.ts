export class DeleteWorkerGroupCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
