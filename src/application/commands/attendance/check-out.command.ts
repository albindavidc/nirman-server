import { Command } from '@nestjs/cqrs';
import { AttendanceResponseDto } from '../../dto/attendance/attendance-response.dto';

export class CheckOutCommand extends Command<AttendanceResponseDto> {
  constructor(
    public readonly userId: string,
    public readonly attendanceId: string,
    public readonly location?: string,
    public readonly supervisorNotes?: string,
  ) {
    super();
  }
}
