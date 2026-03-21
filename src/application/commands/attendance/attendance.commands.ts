import { Command } from '@nestjs/cqrs';
import { AttendanceResponseDto } from '../../dto/attendance/attendance-response.dto';

export class VerifyAttendanceCommand extends Command<AttendanceResponseDto> {
  constructor(
    public readonly attendanceId: string,
    public readonly supervisorId: string,
    public readonly isVerified: boolean,
    public readonly supervisorNotes?: string,
  ) {
    super();
  }
}
