import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ATTENDANCE_READER,
  ATTENDANCE_WRITER,
} from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceReader } from '../../../../domain/repositories/project-attendance/attendance.reader.interface';
import { IAttendanceWriter } from '../../../../domain/repositories/project-attendance/attendance.writer.interface';
import { VerifyAttendanceCommand } from '../../../commands/attendance/attendance.commands';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';

@CommandHandler(VerifyAttendanceCommand)
export class VerifyAttendanceHandler implements ICommandHandler<VerifyAttendanceCommand> {
  constructor(
    @Inject(ATTENDANCE_READER)
    private readonly attendanceReader: IAttendanceReader,
    @Inject(ATTENDANCE_WRITER)
    private readonly attendanceWriter: IAttendanceWriter,
  ) {}

  async execute(
    command: VerifyAttendanceCommand,
  ): Promise<AttendanceResponseDto> {
    const { attendanceId, supervisorId, isVerified, supervisorNotes } = command;

    const attendance = await this.attendanceReader.findById(attendanceId);

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    attendance.verify(supervisorId, isVerified, supervisorNotes);
    const updated = await this.attendanceWriter.save(attendance);

    return AttendanceMapper.toResponseDto(updated);
  }
}
