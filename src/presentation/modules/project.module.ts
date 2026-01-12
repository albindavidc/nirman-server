import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

// Infrastructure
import { PrismaModule } from '../../infrastructure/persistence/prisma/prisma.module';
import { ProjectRepository } from '../../infrastructure/persistence/repositories/project/project.repository';

// Domain interfaces
import { PROJECT_REPOSITORY } from '../../domain/repositories/project-repository.interface';

// Controllers
import { ProjectController } from '../controllers/project.controller';

// Query Handlers
import { GetProjectsHandler } from '../../application/handlers/queries/project/get-projects.handler';
import { GetProjectByIdHandler } from '../../application/handlers/queries/project/get-project-by-id.handler';

// Command Handlers
import { CreateProjectHandler } from '../../application/handlers/commands/project/create-project.handler';
import { UpdateProjectHandler } from '../../application/handlers/commands/project/update-project.handler';
import { DeleteProjectHandler } from '../../application/handlers/commands/project/delete-project.handler';

const QueryHandlers = [GetProjectsHandler, GetProjectByIdHandler];
const CommandHandlers = [
  CreateProjectHandler,
  UpdateProjectHandler,
  DeleteProjectHandler,
];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [ProjectController],
  providers: [
    { provide: PROJECT_REPOSITORY, useClass: ProjectRepository },
    ...QueryHandlers,
    ...CommandHandlers,
  ],
})
export class ProjectModule {}
