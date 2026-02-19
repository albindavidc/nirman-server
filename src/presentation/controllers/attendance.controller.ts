import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CheckInCommand } from '../../application/commands/attendance/check-in.command';
import { CheckOutCommand } from '../../application/commands/attendance/check-out.command';
import { GetMyAttendanceHistoryQuery } from '../../application/queries/attendance/get-my-attendance-history.query';
import { GetMyAttendanceStatsQuery } from '../../application/queries/attendance/get-my-attendance-stats.query';
import { GetProjectAttendanceQuery } from '../../application/queries/attendance/get-project-attendance.query';
import { GetProjectAttendanceStatsQuery } from '../../application/queries/attendance/get-project-attendance-stats.query';
import { CheckInDto } from '../../application/dto/attendance/check-in.dto';
import { CheckOutDto } from '../../application/dto/attendance/check-out.dto';
import {
  AttendanceRecordDto,
  AttendanceStatsDto,
  ProjectAttendanceStatsDto,
} from '../../application/dto/attendance/attendance-response.dto';

// Assuming we have an AuthGuard
// import { AuthGuard } from '../../guards/auth.guard';

import { ATTENDANCE_ROUTES } from '../../common/constants/routes.constants';

@Controller(ATTENDANCE_ROUTES.ROOT)
export class AttendanceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(ATTENDANCE_ROUTES.CHECK_IN)
  async checkIn(
    @Param('projectId') projectId: string,
    @Body() dto: CheckInDto,
  ): Promise<AttendanceRecordDto> {
    // Override/Enforce userId from token if available, for now trusting DTO or should ideally set it here
    // dto.userId = req.user.id;
    // And projectId
    dto.projectId = projectId;

    return this.commandBus.execute(new CheckInCommand(dto));
  }

  @Post(ATTENDANCE_ROUTES.CHECK_OUT)
  async checkOut(@Body() dto: CheckOutDto): Promise<AttendanceRecordDto> {
    return this.commandBus.execute(new CheckOutCommand(dto));
  }

  @Get(ATTENDANCE_ROUTES.GET_MY_HISTORY)
  async getMyHistory(
    @Param('projectId') projectId: string,
    @Query('userId') userId: string, // Should be from token
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<AttendanceRecordDto[]> {
    return this.queryBus.execute(
      new GetMyAttendanceHistoryQuery(userId, projectId, limit, offset),
    );
  }

  @Get(ATTENDANCE_ROUTES.GET_MY_STATS)
  async getMyStats(
    @Param('projectId') projectId: string,
    @Query('userId') userId: string, // Should be from token
  ): Promise<AttendanceStatsDto> {
    return this.queryBus.execute(
      new GetMyAttendanceStatsQuery(userId, projectId),
    );
  }

  @Get(ATTENDANCE_ROUTES.GET_PROJECT_ATTENDANCE)
  async getProjectAttendance(
    @Param('projectId') projectId: string,
    @Query('date') date: string,
  ): Promise<AttendanceRecordDto[]> {
    return this.queryBus.execute(
      new GetProjectAttendanceQuery(projectId, new Date(date)),
    );
  }

  @Get(ATTENDANCE_ROUTES.GET_PROJECT_STATS)
  async getProjectStats(
    @Param('projectId') projectId: string,
    @Query('date') date: string,
  ): Promise<ProjectAttendanceStatsDto> {
    return this.queryBus.execute(
      new GetProjectAttendanceStatsQuery(projectId, new Date(date)),
    );
  }
}
