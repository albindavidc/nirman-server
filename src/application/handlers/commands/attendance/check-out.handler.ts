import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CheckOutCommand } from '../../../commands/attendance/check-out.command';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMapper } from '../../../../infrastructure/mappers/attendance.mapper';

@CommandHandler(CheckOutCommand)
export class CheckOutHandler implements ICommandHandler<CheckOutCommand> {
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(command: CheckOutCommand): Promise<AttendanceResponseDto> {
    const { userId, attendanceId, location, supervisorNotes } = command;

    const entity = await this.attendanceRepository.findById(attendanceId);

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

    const update = await this.attendanceRepository.update(entity);

    return AttendanceMapper.toResponseDto(update);
  }
}
