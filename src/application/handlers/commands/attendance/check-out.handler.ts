import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CheckOutCommand } from '../../../commands/attendance/check-out.command';
import {
  ATTENDANCE_REPOSITORY,
  IAttendanceRepository,
  AttendanceRecord,
} from '../../../../domain/repositories/attendance-repository.interface';

@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(command: CheckOutCommand): Promise<AttendanceRecord> {
    const { dto } = command;

    const record = await this.attendanceRepository.findById(dto.attendanceId);
    if (!record) {
      throw new Error('Attendance record not found');
    }

    if (record.checkOut) {
      throw new Error('User already checked out');
    }

    const checkOutTime = new Date();
    // Calculate work hours
    let workHours = 0;
    if (record.checkIn) {
      const diffMs = checkOutTime.getTime() - record.checkIn.getTime();
      workHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
    }

    return this.attendanceRepository.update(dto.attendanceId, {
      checkOut: checkOutTime,
      workHours: workHours,
      location: dto.location || record.location || undefined, // Keep existing location if not provided
      supervisorNotes: dto.notes,
      status: 'Present',
    });
  }
}
