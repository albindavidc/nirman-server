import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';
import { VerifyAttendanceCommand } from '../../../commands/attendance/attendance.commands';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../mappers/attendance.mapper';

@CommandHandler(VerifyAttendanceCommand)
export class VerifyAttendanceHandler implements ICommandHandler<VerifyAttendanceCommand> {
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(
    command: VerifyAttendanceCommand,
  ): Promise<AttendanceResponseDto> {
    const { attendanceId, supervisorId, isVerified, supervisorNotes } = command;

    const attendance = await this.attendanceRepository.findById(attendanceId);

    if (!attendance) {
      throw new Error('Attendance record not found');
    }

    attendance.verify(supervisorId, isVerified, supervisorNotes);
    const updated = await this.attendanceRepository.update(attendance);

    return AttendanceMapper.toResponseDto(updated);
  }
}
