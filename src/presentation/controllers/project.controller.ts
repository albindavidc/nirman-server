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
  Request,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { GetProjectsQueryDto } from '../../application/dto/project/get-projects.dto';
import { CreateProjectDto } from '../../application/dto/project/create-project.dto';
import { UpdateProjectDto } from '../../application/dto/project/update-project.dto';
import { AddProjectMemberDto } from '../../application/dto/project/add-project-member.dto';
import { GetProjectsQuery } from '../../application/queries/project/get-projects.query';
import { GetProjectByIdQuery } from '../../application/queries/project/get-project-by-id.query';
import { GetProjectAttendanceQuery } from '../../application/queries/project/get-project-attendance.query';
import { ExportProjectAttendanceQuery } from '../../application/queries/project/export-project-attendance.query';
import { GetProfessionalsQuery } from '../../application/queries/project/get-professionals.query';
import { GetProjectMembersQuery } from '../../application/queries/project/get-project-members.query';
import { GetProjectStatsQuery } from '../../application/queries/project/get-project-stats.query';
import { CreateProjectCommand } from '../../application/commands/project/create-project.command';
import { UpdateProjectCommand } from '../../application/commands/project/update-project.command';
import { DeleteProjectCommand } from '../../application/commands/project/delete-project.command';
import { AddProjectMemberCommand } from '../../application/commands/project/add-project-member.command';
import { RemoveProjectMemberCommand } from '../../application/commands/project/remove-project-member.command';
import { UpdateProjectMemberCommand } from '../../application/commands/project/update-project-member.command';
import { ProjectResponseDto } from '../../application/dto/project/project-response.dto';
import { CreateProjectPhaseDto } from '../../application/dto/project/phase/create-project-phase.dto';
import { UpdateProjectMemberDto } from '../../application/dto/project/update-project-member.dto';
import { ProjectPhaseDto } from '../../application/dto/project/phase/project-phase.dto';
import { CreateProjectPhaseCommand } from '../../application/commands/project/create-project-phase.command';
import { UpdateProjectPhaseCommand } from '../../application/commands/project/update-project-phase.command';
import { GetProjectPhasesQuery } from '../../application/queries/project/get-project-phases.query';
import { AttendanceResponseDto } from '../../application/dto/project/attendance-response.dto';
import { ProjectStatsDto } from '../../application/dto/project/project-stats.dto';
import { ProfessionalResponseDto } from '../../application/dto/project/professional-response.dto';
import { ProjectMemberResponseDto } from '../../application/dto/project/project-member-response.dto';

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

import { PROJECT_ROUTES } from '../../app.routes';

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
    @Request() req: { user: { userId: string } },
  ): Promise<ProjectResponseDto> {
    return this.commandBus.execute(
      new CreateProjectCommand(createDto, req.user.userId),
    );
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

  @Get(':id/attendance/export')
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

  @Patch(':id/phases/:phaseId')
  @HttpCode(HttpStatus.OK)
  async updateProjectPhase(
    @Param('phaseId') phaseId: string,
    @Body() updateDto: UpdateProjectPhaseDto,
  ): Promise<ProjectPhaseDto> {
    return this.commandBus.execute(
      new UpdateProjectPhaseCommand(phaseId, updateDto),
    );
  }

  // Project Members Endpoints
  @Get(PROJECT_ROUTES.GET_MEMBERS)
  async getProjectMembers(
    @Param('id') projectId: string,
  ): Promise<ProjectMemberResponseDto[]> {
    return this.queryBus.execute(new GetProjectMembersQuery(projectId));
  }

  @Post(PROJECT_ROUTES.ADD_MEMBERS)
  @HttpCode(HttpStatus.CREATED)
  async addProjectMembers(
    @Param('id') projectId: string,
    @Body() addMemberDto: AddProjectMemberDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new AddProjectMemberCommand(
        projectId,
        addMemberDto.userIds,
        addMemberDto.role,
      ),
    );
  }

  @Patch(PROJECT_ROUTES.UPDATE_MEMBER)
  @HttpCode(HttpStatus.OK)
  async updateProjectMember(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
    @Body() updateDto: UpdateProjectMemberDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateProjectMemberCommand(projectId, userId, updateDto.role),
    );
  }

  @Delete(PROJECT_ROUTES.REMOVE_MEMBER)
  @HttpCode(HttpStatus.OK)
  async removeProjectMember(
    @Param('id') projectId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.commandBus.execute(
      new RemoveProjectMemberCommand(projectId, userId),
    );
  }

  // Phase Approval Endpoints
  @Get(':id/phases/:phaseId/approval')
  async getPhaseForApproval(
    @Param('phaseId') phaseId: string,
  ): Promise<PhaseForApprovalDto> {
    return this.queryBus.execute(new GetPhaseForApprovalQuery(phaseId));
  }

  @Post(':id/phases/:phaseId/approval')
  @HttpCode(HttpStatus.CREATED)
  async createPhaseApproval(
    @Param('phaseId') phaseId: string,
    @Body() dto: CreatePhaseApprovalDto,
    @Request() req: { user: { id: string } },
  ): Promise<PhaseApprovalResponseDto> {
    return this.commandBus.execute(
      new CreatePhaseApprovalCommand(
        phaseId,
        req.user.id,
        req.user.id, // requestedBy
        dto.approvalStatus,
        dto.comments ?? null,
        dto.media ?? [],
      ),
    );
  }

  @Post(':id/phases/:phaseId/approval-request')
  @HttpCode(HttpStatus.CREATED)
  async requestPhaseApproval(
    @Param('phaseId') phaseId: string,
    @Body() dto: RequestPhaseApprovalDto,
    @Request() req: { user: { userId: string } },
  ): Promise<PhaseApprovalResponseDto> {
    return this.commandBus.execute(
      new RequestPhaseApprovalCommand(
        phaseId,
        req.user['id'] || req.user['userId'],
        dto.comments ?? null,
        dto.media ?? [],
        dto.approverId,
      ),
    );
  }

  @Get(':id/approvals')
  async getProjectApprovals(
    @Param('id') projectId: string,
  ): Promise<PhaseApprovalResponseDto[]> {
    return this.queryBus.execute(new GetProjectApprovalsQuery(projectId));
  }
}
