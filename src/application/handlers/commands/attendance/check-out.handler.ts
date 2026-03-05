import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ATTENDANCE_READER,
  ATTENDANCE_WRITER,
} from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceReader } from '../../../../domain/repositories/project-attendance/attendance.reader.interface';
import { IAttendanceWriter } from '../../../../domain/repositories/project-attendance/attendance.writer.interface';
import { CheckOutCommand } from '../../../commands/attendance/check-out.command';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';

@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
  constructor(
    @Inject(ATTENDANCE_READER)
    private readonly attendanceReader: IAttendanceReader,
    @Inject(ATTENDANCE_WRITER)
    private readonly attendanceWriter: IAttendanceWriter,
  ) {}

  async execute(command: CheckOutCommand): Promise<AttendanceResponseDto> {
    const { userId, attendanceId, location, supervisorNotes } = command;

    const entity = await this.attendanceReader.findById(attendanceId);

    if (!entity) {
      throw new Error('Attendance record not found');
    }

    if (entity.userId !== userId) {
      throw new Error('User ID does not match attendance record');
    }

    if (entity.checkOut) {
      throw new Error('User already checked out');
    }

    entity.recordCheckOut(location, supervisorNotes);

    const update = await this.attendanceWriter.save(entity);

    return AttendanceMapper.toResponseDto(update);
  }
}
