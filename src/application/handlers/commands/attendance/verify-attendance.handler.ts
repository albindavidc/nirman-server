import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { VerifyAttendanceCommand } from '../../../commands/attendance/attendance.commands';
import {
  ATTENDANCE_REPOSITORY,
  IAttendanceRepository,
} from '../../../../domain/repositories/attendance-repository.interface';

@CommandHandler(VerifyAttendanceCommand)
export class VerifyAttendanceHandler implements ICommandHandler<VerifyAttendanceCommand> {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(command: VerifyAttendanceCommand): Promise<any> {
    const { attendanceId, supervisorId, isVerified, supervisorNotes } = command;

    return this.attendanceRepository.update(attendanceId, {
      isVerified,
      verifiedBy: supervisorId,
      verifiedAt: new Date(),
      supervisorNotes,
      status: isVerified ? 'Verified' : 'Rejected', // Update status based on verification
    });
  }
}
