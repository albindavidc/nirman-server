export class GetProjectAttendanceQuery {
  constructor(
    public readonly projectId: string,
    public readonly date?: Date,
  ) {}
}
