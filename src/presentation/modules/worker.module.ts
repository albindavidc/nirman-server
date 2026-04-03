import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WorkerController } from '../controllers/worker.controller';
import { CreateWorkerHandler } from '../../application/handlers/commands/worker/create-worker.handler';
import { GetWorkersHandler } from '../../application/handlers/queries/worker/get-workers.handler';
import { UpdateWorkerHandler } from '../../application/handlers/commands/worker/update-worker.handler';
import {
  BlockWorkerHandler,
  UnblockWorkerHandler,
} from '../../application/handlers/commands/worker/block-worker.handler';
import { WorkerRepository } from '../../infrastructure/repositories/worker/worker.repository';
import { WORKER_REPOSITORY } from '../../domain/repositories/worker-repository.interface';
import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

const CommandHandlers = [
  CreateWorkerHandler,
  UpdateWorkerHandler,
  BlockWorkerHandler,
  UnblockWorkerHandler,
];
const QueryHandlers = [GetWorkersHandler];

@Module({
  imports: [CqrsModule, PrismaModule],
  controllers: [WorkerController],
  providers: [
    ...CommandHandlers,
    ...QueryHandlers,
    PrismaService,
    {
      provide: WORKER_REPOSITORY,
      useClass: WorkerRepository,
    },
  ],
  exports: [WORKER_REPOSITORY],
})
export class WorkerModule {}
