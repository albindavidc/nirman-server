import { ICommand } from '@nestjs/cqrs';

export class CheckOutCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly attendanceId: string,
    public readonly location?: string,
    public readonly supervisorNotes?: string,
  ) {}
}
