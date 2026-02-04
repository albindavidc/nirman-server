import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AttendanceController } from '../controllers/attendance.controller';
import { AttendanceRepository } from '../../infrastructure/repositories/attendance.repository';
import { ATTENDANCE_REPOSITORY } from '../../domain/repositories/attendance-repository.interface';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

// Handlers
import { CheckInHandler } from '../../application/handlers/commands/attendance/check-in.handler';
import { CheckOutHandler } from '../../application/handlers/commands/attendance/check-out.handler';
import { GetMyAttendanceHistoryHandler } from '../../application/handlers/queries/attendance/get-my-attendance-history.handler';
import { GetMyAttendanceStatsHandler } from '../../application/handlers/queries/attendance/get-my-attendance-stats.handler';

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [AttendanceController],
  providers: [
    {
      provide: ATTENDANCE_REPOSITORY,
      useClass: AttendanceRepository,
    },
    CheckInHandler,
    CheckOutHandler,
    GetMyAttendanceHistoryHandler,
    GetMyAttendanceStatsHandler,
  ],
})
export class AttendanceModule {}
