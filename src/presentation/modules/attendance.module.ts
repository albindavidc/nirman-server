import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AttendanceController } from '../controllers/attendance.controller';
import { AttendanceRepository } from '../../infrastructure/repositories/attendance.repository';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { IAttendanceRepository } from '../../domain/repositories/attendance-repository.interface';

// Handlers
import { CheckInHandler } from '../../application/handlers/commands/attendance/check-in.handler';
import { CheckOutHandler } from '../../application/handlers/commands/attendance/check-out.handler';
import { VerifyAttendanceHandler } from '../../application/handlers/commands/attendance/verify-attendance.handler';

import { GetMyAttendanceHistoryHandler } from '../../application/handlers/queries/attendance/get-my-attendance-history.handler';
import { GetMyAttendanceStatsHandler } from '../../application/handlers/queries/attendance/get-my-attendance-stats.handler';
import { GetMyAttendanceSummaryHandler } from '../../application/handlers/queries/attendance/get-my-attendance-summary.handler';
import { GetProjectAttendanceStatsHandler } from '../../application/handlers/queries/attendance/get-project-attendance-stats.handler';
import { GetProjectAttendanceHandler } from '../../application/handlers/queries/attendance/get-project-attendance.handler';
import { GetTodayAttendanceHandler } from '../../application/handlers/queries/attendance/get-today-attendance.handler';

const CommandHandlers = [
  CheckInHandler,
  CheckOutHandler,
  VerifyAttendanceHandler,
];
const QueryHandlers = [
  GetMyAttendanceHistoryHandler,
  GetMyAttendanceStatsHandler,
  GetMyAttendanceSummaryHandler,
  GetProjectAttendanceStatsHandler,
  GetProjectAttendanceHandler,
  GetTodayAttendanceHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [AttendanceController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    {
      provide: IAttendanceRepository,
      useClass: AttendanceRepository,
    },
  ],
})
export class AttendanceModule {}
