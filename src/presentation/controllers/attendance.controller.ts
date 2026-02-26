import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ATTENDANCE_ROUTES } from '../../common/constants/routes.constants';
import { CheckInRequestDto } from '../../application/dto/attendance/check-in-request.dto';
import { CheckInCommand } from '../../application/commands/attendance/check-in.command';
import { AttendanceResponseDto } from '../../application/dto/attendance/attendance-response.dto';
import { VerifyAttendanceRequestDto } from '../../application/dto/attendance/attendance-verify-request.dto';
import { VerifyAttendanceCommand } from '../../application/commands/attendance/attendance.commands';
import { GetMyTodayAttendanceQuery } from '../../application/queries/attendance/get-my-today-attendance.query';
import { GetAttendanceHistoryRequestDto } from '../../application/dto/attendance/attendance-history-request.dto';
import { GetMyAttendanceHistoryQuery } from '../../application/queries/attendance/get-my-attendance-history.query';
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

@Controller(ATTENDANCE_ROUTES.ROOT)
export class AttendanceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(ATTENDANCE_ROUTES.CHECK_IN)
  @HttpCode(HttpStatus.CREATED)
  async checkIn(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CheckInRequestDto,
  ): Promise<AttendanceResponseDto> {
    return this.commandBus.execute<CheckInCommand, AttendanceResponseDto>(
      new CheckInCommand(
        req.user.userId,
        dto.projectId,
        dto.location,
        dto.method,
        dto.supervisorNotes,
      ),
    );
  }

  @Patch(ATTENDANCE_ROUTES.CHECK_OUT)
  @HttpCode(HttpStatus.OK)
  async checkOut(
    @Request() req: AuthenticatedRequest,
    @Body() dto: CheckInRequestDto,
  ): Promise<AttendanceResponseDto> {
    return this.commandBus.execute<CheckInCommand, AttendanceResponseDto>(
      new CheckInCommand(
        req.user.userId,
        dto.projectId,
        dto.location,
        dto.method,
        dto.supervisorNotes,
      ),
    );
  }

  @Patch(ATTENDANCE_ROUTES.VERIFY)
  @HttpCode(HttpStatus.OK)
  async verify(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: VerifyAttendanceRequestDto,
  ) {
    return this.commandBus.execute<
      VerifyAttendanceCommand,
      AttendanceResponseDto
    >(new VerifyAttendanceCommand(id, req.user.userId, dto.supervisorNotes));
  }

  @Get(ATTENDANCE_ROUTES.GET_MY_ATTENDANCE)
  async getMyTodayAttendance(
    @Request() req: AuthenticatedRequest,
    @Query('projectId') projectId: string,
  ) {
    return this.queryBus.execute<
      GetMyTodayAttendanceQuery,
      AttendanceResponseDto
    >(new GetMyTodayAttendanceQuery(req.user.userId, projectId));
  }

  @Get(ATTENDANCE_ROUTES.GET_MY_SUMMARY)
  async getMySummary(
    @Request() req: AuthenticatedRequest,
    @Query('projectId') projectId: string,
  ) {
    return this.queryBus.execute<
      GetMyTodayAttendanceQuery,
      AttendanceResponseDto
    >(new GetMyTodayAttendanceQuery(req.user.userId, projectId));
  }

  @Get(ATTENDANCE_ROUTES.GET_MY_HISTORY)
  async getMyHistory(
    @Request() req: AuthenticatedRequest,
    @Query() dto: GetAttendanceHistoryRequestDto,
  ) {
    return this.queryBus.execute<
      GetMyAttendanceHistoryQuery,
      AttendanceResponseDto
    >(
      new GetMyAttendanceHistoryQuery({
        userId: req.user.userId,
        projectId: dto.projectId,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        status: dto.status,
        page: dto.page,
        limit: dto.limit,
      }),
    );
  }

  // @Post(ATTENDANCE_ROUTES.CHECK_IN)
  // async checkIn(
  //   @Param('projectId') projectId: string,
  //   @Body() dto: CheckInDto,
  // ): Promise<AttendanceRecordDto> {
  //   // Override/Enforce userId from token if available, for now trusting DTO or should ideally set it here
  //   // dto.userId = req.user.id;
  //   // And projectId
  //   dto.projectId = projectId;

  //   return this.commandBus.execute(new CheckInCommand(dto));
  // }

  // @Post(ATTENDANCE_ROUTES.CHECK_OUT)
  // async checkOut(@Body() dto: CheckOutDto): Promise<AttendanceRecordDto> {
  //   return this.commandBus.execute(new CheckOutCommand(dto));
  // }

  // @Get(ATTENDANCE_ROUTES.GET_MY_HISTORY)
  // async getMyHistory(
  //   @Param('projectId') projectId: string,
  //   @Query('userId') userId: string, // Should be from token
  //   @Query('limit') limit: number,
  //   @Query('offset') offset: number,
  // ): Promise<AttendanceRecordDto[]> {
  //   return this.queryBus.execute(
  //     new GetMyAttendanceHistoryQuery(userId, projectId, limit, offset),
  //   );
  // }

  // @Get(ATTENDANCE_ROUTES.GET_MY_STATS)
  // async getMyStats(
  //   @Param('projectId') projectId: string,
  //   @Query('userId') userId: string, // Should be from token
  // ): Promise<AttendanceStatsDto> {
  //   return this.queryBus.execute(
  //     new GetMyAttendanceStatsQuery(userId, projectId),
  //   );
  // }

  // @Get(ATTENDANCE_ROUTES.GET_PROJECT_ATTENDANCE)
  // async getProjectAttendance(
  //   @Param('projectId') projectId: string,
  //   @Query('date') date: string,
  // ): Promise<AttendanceRecordDto[]> {
  //   return this.queryBus.execute(
  //     new GetProjectAttendanceQuery(projectId, new Date(date)),
  //   );
  // }

  // @Get(ATTENDANCE_ROUTES.GET_PROJECT_STATS)
  // async getProjectStats(
  //   @Param('projectId') projectId: string,
  //   @Query('date') date: string,
  // ): Promise<ProjectAttendanceStatsDto> {
  //   return this.queryBus.execute(
  //     new GetProjectAttendanceStatsQuery(projectId, new Date(date)),
  //   );
  // }
}
