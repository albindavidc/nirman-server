import { Command } from '@nestjs/cqrs';
import { AttendanceResponseDto } from '../../dto/attendance/attendance-response.dto';

export class CheckInCommand extends Command<AttendanceResponseDto> {
  constructor(
    public readonly userId: string,
    public readonly projectId: string,
    public readonly location?: string,
    public readonly method?: string,
    public readonly supervisorNotes?: string,
  ) {
    super();
  }
}
