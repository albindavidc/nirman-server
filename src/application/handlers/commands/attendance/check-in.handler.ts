import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CheckInCommand } from '../../../commands/attendance/check-in.command';
import { IAttendanceRepository } from '../../../../domain/repositories/attendance-repository.interface';
import { AttendanceResponseDto } from '../../../dto/attendance/attendance-response.dto';
import { AttendanceMethod } from '../../../../domain/value-objects/attendance-method.vo';
import { AttendanceMapper } from '../../../../infrastructure/mappers/attendance.mapper';
import { AttendanceEntity } from '../../../../domain/entities/attendance.entity';

@CommandHandler(CheckInCommand)
export class CheckInHandler implements ICommandHandler<CheckInCommand> {
  constructor(
    @Inject(IAttendanceRepository)
    private readonly attendanceRepository: IAttendanceRepository,
  ) {}

  async execute(command: CheckInCommand): Promise<AttendanceResponseDto> {
    const { userId, projectId, location, method, supervisorNotes } = command;

    const alreadyCheckIn = await this.attendanceRepository.existsTodayForUser(
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

    const saved = await this.attendanceRepository.save(attendance);

    return AttendanceMapper.toResponseDto(saved);
  }
}
