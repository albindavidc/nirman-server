export class GetProjectAttendanceStatsQuery {
  constructor(
    public readonly projectId: string,
    public readonly date: Date,
  ) {}
}
