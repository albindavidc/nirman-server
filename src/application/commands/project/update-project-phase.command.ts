export class UpdateProjectPhaseCommand {
  constructor(
    public readonly phaseId: string,
    public readonly data: {
      name?: string;
      description?: string;
      progress?: number;
      status?: string;
      plannedStartDate?: string;
      plannedEndDate?: string;
      actualStartDate?: string;
      actualEndDate?: string;
      sequence?: number;
    },
  ) {}
}
