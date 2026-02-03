import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { TaskController } from '../controllers/task.controller';
import { TaskRepository } from '../../infrastructure/persistence/repositories/project/task.repository';
import { TASK_REPOSITORY } from '../../domain/repositories/task-repository.interface';
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
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [TASK_REPOSITORY],
})
export class TaskModule {}
