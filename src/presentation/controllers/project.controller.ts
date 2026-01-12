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
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import { GetProjectsQueryDto } from '../../application/dto/project/get-projects.dto';
import { CreateProjectDto } from '../../application/dto/project/create-project.dto';
import { UpdateProjectDto } from '../../application/dto/project/update-project.dto';
import { GetProjectsQuery } from '../../application/queries/project/get-projects.query';
import { GetProjectByIdQuery } from '../../application/queries/project/get-project-by-id.query';
import { CreateProjectCommand } from '../../application/commands/project/create-project.command';
import { UpdateProjectCommand } from '../../application/commands/project/update-project.command';
import { DeleteProjectCommand } from '../../application/commands/project/delete-project.command';
import { ProjectResponseDto } from '../../application/dto/project/project-response.dto';
import { PrismaService } from '../../infrastructure/persistence/prisma/prisma.service';

import { PROJECT_ROUTES } from '../../app.routes';

@Controller(PROJECT_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class ProjectController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly prisma: PrismaService,
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
  async getStats() {
    const [total, active, completed, paused] = await Promise.all([
      this.prisma.project.count(),
      this.prisma.project.count({ where: { status: 'active' } }),
      this.prisma.project.count({ where: { status: 'completed' } }),
      this.prisma.project.count({ where: { status: 'paused' } }),
    ]);

    // Get aggregated budget data
    const budgetData = await this.prisma.project.aggregate({
      _sum: {
        budget: true,
        spent: true,
      },
    });

    return {
      total,
      active,
      completed,
      paused,
      totalBudget: budgetData._sum.budget ?? 0,
      totalSpent: budgetData._sum.spent ?? 0,
    };
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

  @Delete(PROJECT_ROUTES.DELETE_PROJECT)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProject(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteProjectCommand(id));
  }
}
