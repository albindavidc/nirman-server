import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AttendanceEntity } from '../../../../domain/entities/attendance.entity';
import {
  ATTENDANCE_WRITER,
  ATTENDANCE_QUERY_READER,
} from '../../../../domain/repositories/project-attendance/attendance-repository.interface';
import { IAttendanceWriter } from '../../../../domain/repositories/project-attendance/attendance.writer.interface';
import { IAttendanceQueryReader } from '../../../../domain/repositories/project-attendance/attendance.query-reader.interface';
import { AttendanceMethod } from '../../../../domain/value-objects/attendance-method.vo';
import { CheckInCommand } from '../../../commands/attendance/check-in.command';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(
    @Inject(ATTENDANCE_WRITER)
    private readonly attendanceWriter: IAttendanceWriter,
    @Inject(ATTENDANCE_QUERY_READER)
    private readonly attendanceQueryReader: IAttendanceQueryReader,
  ) {}

  async execute(command: CheckInCommand): Promise<AttendanceResponseDto> {
    const { userId, projectId, location, method, supervisorNotes } = command;

    const alreadyCheckIn = await this.attendanceQueryReader.existsTodayForUser(
      userId,
      projectId,
    );

    if (alreadyCheckIn) {
      throw new Error('User already checked in for today');
    }

    const attendance = AttendanceEntity.recordCheckIn({
      userId,
      projectId,
      location,
      method: method
        ? AttendanceMethod.fromString(method)
        : AttendanceMethod.MANUAL,
      supervisorNotes,
    });

    const saved = await this.attendanceWriter.save(attendance);

    return AttendanceMapper.toResponseDto(saved);
  }
}
