import { ICommand } from '@nestjs/cqrs';

export class VerifyAttendanceCommand implements ICommand {
  constructor(
    public readonly attendanceId: string,
    public readonly supervisorId: string,
    public readonly isVerified: boolean,
    public readonly supervisorNotes?: string,
  ) {}
}
