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

// Assuming we have an AuthGuard
// import { AuthGuard } from '../../guards/auth.guard';

@Controller('api/v1/projects/:projectId/attendance')
export class AttendanceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('check-in')
  async checkIn(
    @Param('projectId') projectId: string,
    @Body() dto: CheckInDto,
  ): Promise<any> {
    // Override/Enforce userId from token if available, for now trusting DTO or should ideally set it here
    // dto.userId = req.user.id;
    // And projectId
    dto.projectId = projectId;

    return this.commandBus.execute(new CheckInCommand(dto));
  }

  @Post('check-out')
  async checkOut(@Body() dto: CheckOutDto): Promise<any> {
    return this.commandBus.execute(new CheckOutCommand(dto));
  }

  @Get('me/history')
  async getMyHistory(
    @Param('projectId') projectId: string,
    @Query('userId') userId: string, // Should be from token
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<any> {
    return this.queryBus.execute(
      new GetMyAttendanceHistoryQuery(userId, projectId, limit, offset),
    );
  }

  @Get('me/stats')
  async getMyStats(
    @Param('projectId') projectId: string,
    @Query('userId') userId: string, // Should be from token
  ): Promise<any> {
    return this.queryBus.execute(
      new GetMyAttendanceStatsQuery(userId, projectId),
    );
  }

  @Get('')
  async getProjectAttendance(
    @Param('projectId') projectId: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.queryBus.execute(
      new GetProjectAttendanceQuery(projectId, new Date(date)),
    );
  }

  @Get('stats')
  async getProjectStats(
    @Param('projectId') projectId: string,
    @Query('date') date: string,
  ): Promise<any> {
    return this.queryBus.execute(
      new GetProjectAttendanceStatsQuery(projectId, new Date(date)),
    );
  }
}
