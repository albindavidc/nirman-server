import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { TaskController } from '../controllers/task.controller';
import { TaskRepository } from '../../infrastructure/repositories/project-phase/task.repository';
import { TaskQueryRepository } from '../../infrastructure/repositories/project-phase/task.query-repository';
import { TASK_REPOSITORY } from '../../domain/repositories/project-phase/task.repository.interface';
import { TASK_QUERY_REPOSITORY } from '../../domain/repositories/project-phase/task.query-repository.interface';
import {
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
  AddTaskDependencyHandler,
  RemoveTaskDependencyHandler,
} from '../../application/handlers/commands/project/task.handlers';
import {
  GetPhaseTasksHandler,
  GetTaskDetailsHandler,
  GetTaskDependenciesHandler,
  GetProjectTasksHandler,
  GetProjectDependenciesHandler,
} from '../../application/handlers/queries/project/task.handlers';
import { GetMyTasksHandler } from '../../application/handlers/queries/project/get-my-tasks.handler';

const CommandHandlers = [
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
  AddTaskDependencyHandler,
  RemoveTaskDependencyHandler,
];

const QueryHandlers = [
  GetPhaseTasksHandler,
  GetTaskDetailsHandler,
  GetTaskDependenciesHandler,
  GetProjectTasksHandler,
  GetProjectDependenciesHandler,
  GetMyTasksHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [TaskController],
  providers: [
    {
      provide: TASK_REPOSITORY,
      useClass: TaskRepository,
    },
    {
      provide: TASK_QUERY_REPOSITORY,
      useClass: TaskQueryRepository,
    },
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [TASK_REPOSITORY, TASK_QUERY_REPOSITORY],
})
export class TaskModule {}
