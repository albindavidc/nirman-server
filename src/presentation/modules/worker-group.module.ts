import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { WorkerGroupController } from '../controllers/worker-group.controller';
import {
  WORKER_GROUP_QUERY_REPOSITORY,
  WORKER_GROUP_REPOSITORY,
} from 'src/domain/repositories/worker';
import { WorkerGroupRepository } from 'src/infrastructure/repositories/worker/worker-group/worker-group.repository';
import { WorkerGroupQueryRepository } from 'src/infrastructure/repositories/worker/worker-group/worker-group.query.repository';
import { WorkerGroupCommandHandler } from 'src/application/commands/worker/worker-group';
import { WorkerGroupQueryHandler } from 'src/application/queries/worker/worker-group/index';

import { WorkerModule } from './worker.module';

@Module({
  imports: [CqrsModule, PrismaModule, WorkerModule],
  controllers: [WorkerGroupController],
  providers: [
    {
      provide: WORKER_GROUP_REPOSITORY,
      useClass: WorkerGroupRepository,
    },
    {
      provide: WORKER_GROUP_QUERY_REPOSITORY,
      useClass: WorkerGroupQueryRepository,
    },

    ...WorkerGroupCommandHandler,
    ...WorkerGroupQueryHandler,
  ],
})
export class WorkerGroupModule {}
