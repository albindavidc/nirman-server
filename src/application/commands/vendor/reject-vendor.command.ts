export class RejectVendorCommand {
  constructor(
    public readonly id: string,
    public readonly reason: string,
  ) {}
}
