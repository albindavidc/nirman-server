import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CheckInCommand } from '../../../commands/attendance/check-in.command';
import {
  ATTENDANCE_REPOSITORY,
  IAttendanceRepository,
  AttendanceRecord,
} from '../../../../domain/repositories/attendance-repository.interface';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(
    @Inject(ATTENDANCE_REPOSITORY)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(command: CheckInCommand): Promise<AttendanceRecord> {
    const { dto } = command;
    const today = new Date();

    // Check if already checked in
    const existingRecord =
      await this.attendanceRepository.findByUserProjectDate(
        dto.userId,
        dto.projectId,
        today,
      );

    if (existingRecord) {
      throw new Error('User already checked in for today');
    }

    // Create new attendance record
    return this.attendanceRepository.create({
      userId: dto.userId,
      projectId: dto.projectId,
      date: today,
      checkIn: new Date(),
      status: 'Present',
      location: dto.location,
      method: 'Manual', // Or derive from context
      workHours: 0,
      isVerified: false,
    });
  }
}
