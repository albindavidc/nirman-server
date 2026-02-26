import { ICommand } from '@nestjs/cqrs';

export class CheckInCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
    public readonly location?: string,
    public readonly method?: string,
    public readonly supervisorNotes?: string,
  ) {}
}
