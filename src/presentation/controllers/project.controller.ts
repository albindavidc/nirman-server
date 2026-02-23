import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { GetProjectsQueryDto } from '../../application/dto/project/get-projects.dto';
import { CreateProjectDto } from '../../application/dto/project/create-project.dto';
import { UpdateProjectDto } from '../../application/dto/project/update-project.dto';
import { AddProjectWorkerDto } from '../../application/dto/project/add-project-worker.dto';
import { GetProjectsQuery } from '../../application/queries/project/get-projects.query';
import { GetProjectByIdQuery } from '../../application/queries/project/get-project-by-id.query';
import { GetProjectAttendanceQuery } from '../../application/queries/project/get-project-attendance.query';
import { ExportProjectAttendanceQuery } from '../../application/queries/project/export-project-attendance.query';
import { GetProfessionalsQuery } from '../../application/queries/project/get-professionals.query';
import { GetProjectWorkersQuery } from '../../application/queries/project/get-project-workers.query';
import { GetProjectStatsQuery } from '../../application/queries/project/get-project-stats.query';
import { CreateProjectCommand } from '../../application/commands/project/create-project.command';
import { UpdateProjectCommand } from '../../application/commands/project/update-project.command';
import { DeleteProjectCommand } from '../../application/commands/project/delete-project.command';
import { AddProjectWorkerCommand } from '../../application/commands/project/add-project-worker.command';
import { RemoveProjectWorkerCommand } from '../../application/commands/project/remove-project-worker.command';
import { UpdateProjectWorkerCommand } from '../../application/commands/project/update-project-worker.command';
import { ProjectResponseDto } from '../../application/dto/project/project-response.dto';
import { CreateProjectPhaseDto } from '../../application/dto/project/phase/create-project-phase.dto';
import { UpdateProjectWorkerDto } from '../../application/dto/project/update-project-worker.dto';
import { ProjectPhaseDto } from '../../application/dto/project/phase/project-phase.dto';
import { CreateProjectPhaseCommand } from '../../application/commands/project/create-project-phase.command';
import { UpdateProjectPhaseCommand } from '../../application/commands/project/update-project-phase.command';
import { GetProjectPhasesQuery } from '../../application/queries/project/get-project-phases.query';
import { AttendanceResponseDto } from '../../application/dto/project/attendance-response.dto';
import { ProjectStatsDto } from '../../application/dto/project/project-stats.dto';
import { ProfessionalResponseDto } from '../../application/dto/project/professional-response.dto';
import { ProjectWorkerResponseDto } from '../../application/dto/project/project-worker-response.dto';

import { CreatePhaseApprovalDto } from '../../application/dto/phase-approval/create-phase-approval.dto';
import {
  PhaseForApprovalDto,
  PhaseApprovalResponseDto,
} from '../../application/dto/phase-approval/phase-approval-response.dto';
import { GetPhaseForApprovalQuery } from '../../application/queries/phase-approval/get-phase-for-approval.query';
import { CreatePhaseApprovalCommand } from '../../application/commands/phase-approval/create-phase-approval.command';
import { RequestPhaseApprovalCommand } from '../../application/commands/phase-approval/request-phase-approval.command';
import { RequestPhaseApprovalDto } from '../../application/dto/phase-approval/request-phase-approval.dto';
import { UpdateProjectPhaseDto } from '../../application/dto/project/phase/update-project-phase.dto';

import { GetProjectApprovalsQuery } from '../../application/queries/phase-approval/get-project-approvals.query';
import { GetAllPhaseApprovalsQuery } from '../../application/queries/phase-approval/get-all-phase-approvals.query';

import { PROJECT_ROUTES } from '../../common/constants/routes.constants';

@Controller(PROJECT_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Post(PROJECT_ROUTES.CREATE_PROJECT)
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @Body() createDto: CreateProjectDto,
    @User('id') userId: string,
  ): Promise<ProjectResponseDto> {
    return this.commandBus.execute(new CreateProjectCommand(createDto, userId));
  }

  @Get(PROJECT_ROUTES.GET_PROJECTS)
  async getProjects(@Query() queryDto: GetProjectsQueryDto): Promise<{
    data: ProjectResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.queryBus.execute(
      new GetProjectsQuery(
        queryDto.status,
        queryDto.search,
        queryDto.page,
        queryDto.limit,
      ),
    );
  }

  @Get(PROJECT_ROUTES.GET_STATS)
  async getStats(): Promise<ProjectStatsDto> {
    return this.queryBus.execute(new GetProjectStatsQuery());
  }

  @Get(PROJECT_ROUTES.GET_PROFESSIONALS)
  async getProfessionals(
    @Query('search') search?: string,
    @Query('excludeProjectId') excludeProjectId?: string,
  ): Promise<ProfessionalResponseDto[]> {
    return this.queryBus.execute(
      new GetProfessionalsQuery(search, excludeProjectId),
    );
  }

  @Get(PROJECT_ROUTES.GET_PROJECT_BY_ID)
  async getProjectById(
    @Param('id') id: string,
  ): Promise<ProjectResponseDto | null> {
    return this.queryBus.execute(new GetProjectByIdQuery(id));
  }

  @Patch(PROJECT_ROUTES.UPDATE_PROJECT)
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Param('id') id: string,
    @Body() updateDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.commandBus.execute(new UpdateProjectCommand(id, updateDto));
  }

  @Get(PROJECT_ROUTES.GET_ATTENDANCE)
  async getAttendance(
    @Param('id') id: string,
  ): Promise<AttendanceResponseDto[]> {
    return this.queryBus.execute(new GetProjectAttendanceQuery(id));
  }

  @Get(PROJECT_ROUTES.EXPORT_ATTENDANCE)
  async exportProjectAttendance(
    @Param('id') projectId: string,
    @Res() res: Response,
  ): Promise<void> {
    const pdfStream: PDFKit.PDFDocument = await this.queryBus.execute(
      new ExportProjectAttendanceQuery(projectId),
    );

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="attendance-report-${projectId}.pdf"`,
    });

    pdfStream.pipe(res);
  }

  @Delete(PROJECT_ROUTES.DELETE_PROJECT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteProjectCommand(id));
  }

  @Post(PROJECT_ROUTES.CREATE_PHASE)
  @HttpCode(HttpStatus.CREATED)
  async createProjectPhase(
    @Param('id') projectId: string,
    @Body() createDto: CreateProjectPhaseDto,
  ): Promise<ProjectPhaseDto> {
    createDto.projectId = projectId;
    return this.commandBus.execute(new CreateProjectPhaseCommand(createDto));
  }

  @Get(PROJECT_ROUTES.GET_PHASES)
  async getProjectPhases(
    @Param('id') projectId: string,
  ): Promise<ProjectPhaseDto[]> {
    return this.queryBus.execute(new GetProjectPhasesQuery(projectId));
  }

  @Patch(PROJECT_ROUTES.UPDATE_PHASE)
  @HttpCode(HttpStatus.OK)
  async updateProjectPhase(
    @Param('phaseId') phaseId: string,
    @Body() updateDto: UpdateProjectPhaseDto,
  ): Promise<ProjectPhaseDto> {
    return this.commandBus.execute(
      new UpdateProjectPhaseCommand(phaseId, updateDto),
    );
  }

  // Project Workers Endpoints
  @Get(PROJECT_ROUTES.GET_WORKERS)
  async getProjectWorkers(
    @Param('id') projectId: string,
  ): Promise<ProjectWorkerResponseDto[]> {
    return this.queryBus.execute(new GetProjectWorkersQuery(projectId));
  }

  @Post(PROJECT_ROUTES.ADD_WORKERS)
  @HttpCode(HttpStatus.CREATED)
  async addProjectWorkers(
    @Param('id') projectId: string,
    @Body() addWorkerDto: AddProjectWorkerDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new AddProjectWorkerCommand(
        projectId,
        addWorkerDto.userIds,
        addWorkerDto.role,
      ),
    );
  }

  @Patch(PROJECT_ROUTES.UPDATE_WORKER)
  @HttpCode(HttpStatus.OK)
  async updateProjectWorker(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateProjectWorkerDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateProjectWorkerCommand(projectId, userId, updateDto.role),
    );
  }

  @Delete(PROJECT_ROUTES.REMOVE_WORKER)
  @HttpCode(HttpStatus.OK)
  async removeProjectWorker(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.commandBus.execute(
      new RemoveProjectWorkerCommand(projectId, userId),
    );
  }

  // Phase Approval Endpoints
  @Get(PROJECT_ROUTES.GET_PHASE_APPROVAL)
  async getPhaseForApproval(
    @Param('phaseId') phaseId: string,
  ): Promise<PhaseForApprovalDto> {
    return this.queryBus.execute(new GetPhaseForApprovalQuery(phaseId));
  }

  @Post(PROJECT_ROUTES.CREATE_PHASE_APPROVAL)
  @HttpCode(HttpStatus.CREATED)
  async createPhaseApproval(
    @Param('phaseId') phaseId: string,
    @Body() dto: CreatePhaseApprovalDto,
    @User('userId') userId: string,
  ): Promise<PhaseApprovalResponseDto> {
    if (!dto) {
      throw new BadRequestException('Request body is empty');
    }
    console.log('Received Approval Request:', { phaseId, dto, userId });

    return this.commandBus.execute(
      new CreatePhaseApprovalCommand(
        phaseId,
        userId,
        userId, // requestedBy
        dto.approvalStatus,
        dto.comments ?? null,
        dto.media ?? [],
      ),
    );
  }

  @Post(PROJECT_ROUTES.REQUEST_PHASE_APPROVAL)
  @HttpCode(HttpStatus.CREATED)
  async requestPhaseApproval(
    @Param('phaseId') phaseId: string,
    @Body() dto: RequestPhaseApprovalDto,
    @User('userId') userId: string,
  ): Promise<PhaseApprovalResponseDto> {
    return this.commandBus.execute(
      new RequestPhaseApprovalCommand(
        phaseId,
        userId,
        dto.comments ?? null,
        dto.media ?? [],
        dto.approverId,
      ),
    );
  }

  @Get(PROJECT_ROUTES.GET_ALL_APPROVALS)
  async getAllPhaseApprovals(): Promise<PhaseApprovalResponseDto[]> {
    return this.queryBus.execute(new GetAllPhaseApprovalsQuery());
  }

  @Get(PROJECT_ROUTES.GET_PROJECT_APPROVALS)
  async getProjectApprovals(
    @Param('id') projectId: string,
  ): Promise<PhaseApprovalResponseDto[]> {
    return this.queryBus.execute(new GetProjectApprovalsQuery(projectId));
  }
}
