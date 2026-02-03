export class ProjectPhase {
  constructor(
    public id: string,
    public projectId: string,
    public name: string,
    public description: string | null,
    public progress: number,
    public plannedStartDate: Date | null,
    public plannedEndDate: Date | null,
    public actualStartDate: Date | null,
    public actualEndDate: Date | null,
    public status: string,
    public sequence: number,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
