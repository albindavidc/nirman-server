import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { User } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../common/security/guards/jwt-auth.guard';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateTaskDependencyDto,
  TaskDto,
  TaskDependencyDto,
} from '../../application/dto/project/task.dto';
import {
  CreateTaskCommand,
  UpdateTaskCommand,
  DeleteTaskCommand,
  AddTaskDependencyCommand,
  RemoveTaskDependencyCommand,
} from '../../application/commands/project/task.commands';
import {
  GetPhaseTasksQuery,
  GetTaskDetailsQuery,
  GetTaskDependenciesQuery,
  GetProjectTasksQuery,
  GetProjectDependenciesQuery,
} from '../../application/queries/project/task.queries';
import { GetMyTasksQuery } from '../../application/queries/project/get-my-tasks.query';

import { TASK_ROUTES } from '../../app.routes';

// AuthenticatedRequest interface removed

@Controller(TASK_ROUTES.ROOT)
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get(TASK_ROUTES.GET_MY_TASKS)
  async getMyTasks(@User('id') userId: string): Promise<TaskDto[]> {
    return this.queryBus.execute(new GetMyTasksQuery(userId));
  }

  @Post(TASK_ROUTES.CREATE_TASK)
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() dto: CreateTaskDto): Promise<TaskDto> {
    return this.commandBus.execute(new CreateTaskCommand(dto));
  }

  @Patch(TASK_ROUTES.UPDATE_TASK)
  @HttpCode(HttpStatus.OK)
  async updateTask(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ): Promise<TaskDto> {
    return this.commandBus.execute(new UpdateTaskCommand(id, dto));
  }

  @Delete(TASK_ROUTES.DELETE_TASK)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTask(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new DeleteTaskCommand(id));
  }

  @Get(TASK_ROUTES.GET_TASK_BY_ID)
  async getTaskDetails(@Param('id') id: string): Promise<TaskDto> {
    return this.queryBus.execute(new GetTaskDetailsQuery(id));
  }

  @Get(TASK_ROUTES.GET_PROJECT_DEPENDENCIES)
  async getProjectDependencies(
    @Param('projectId') projectId: string,
  ): Promise<TaskDependencyDto[]> {
    return this.queryBus.execute(new GetProjectDependenciesQuery(projectId));
  }

  @Get(TASK_ROUTES.GET_PHASE_TASKS)
  async getPhaseTasks(@Param('phaseId') phaseId: string): Promise<TaskDto[]> {
    return this.queryBus.execute(new GetPhaseTasksQuery(phaseId));
  }

  @Get(TASK_ROUTES.GET_PROJECT_TASKS)
  async getProjectTasks(
    @Param('projectId') projectId: string,
  ): Promise<TaskDto[]> {
    return this.queryBus.execute(new GetProjectTasksQuery(projectId));
  }

  @Post(TASK_ROUTES.ADD_DEPENDENCY)
  @HttpCode(HttpStatus.CREATED)
  async addDependency(
    @Body() dto: CreateTaskDependencyDto,
  ): Promise<TaskDependencyDto> {
    return this.commandBus.execute(new AddTaskDependencyCommand(dto));
  }

  @Delete(TASK_ROUTES.REMOVE_DEPENDENCY)
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDependency(@Param('id') id: string): Promise<void> {
    return this.commandBus.execute(new RemoveTaskDependencyCommand(id));
  }

  @Get(TASK_ROUTES.GET_PHASE_DEPENDENCIES)
  async getPhaseDependencies(
    @Param('phaseId') phaseId: string,
  ): Promise<TaskDependencyDto[]> {
    return this.queryBus.execute(new GetTaskDependenciesQuery(phaseId));
  }
}
