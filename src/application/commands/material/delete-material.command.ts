export class DeleteMaterialCommand {
  constructor(
    public readonly materialId: string,
    public readonly userId: string,
  ) {}
}
