import { ICommand } from '@nestjs/cqrs';

export class CheckInCommand implements ICommand {
  constructor(
    public readonly projectId: string,
    public readonly userId: string,
    public readonly location?: string,
    public readonly method?: string,
  ) {}
}

export class CheckOutCommand implements ICommand {
  constructor(
    public readonly attendanceId: string,
    public readonly checkOutTime?: Date,
  ) {}
}

export class VerifyAttendanceCommand implements ICommand {
  constructor(
    public readonly attendanceId: string,
    public readonly supervisorId: string,
    public readonly isVerified: boolean,
    public readonly supervisorNotes?: string,
  ) {}
}
