import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { WORKER_ROUTES } from '../../common/constants/routes.constants';
import { CreateWorkerDto } from '../../application/dto/worker/create-worker.dto';
import { CreateWorkerCommand } from '../../application/commands/worker/create-worker.command';
import {
  WorkerListResponseDto,
  WorkerResponseDto,
} from '../../application/dto/worker/worker-response.dto';
import { GetWorkersQuery } from '../../application/queries/worker/get-workers.query';
import { UpdateWorkerDto } from '../../application/dto/worker/update-worker.dto';
import { UpdateWorkerCommand } from '../../application/commands/worker/update-worker.command';
import {
  BlockWorkerCommand,
  UnblockWorkerCommand,
} from '../../application/commands/worker/block-worker.command';
import { Roles } from '../../common/security/decorators/roles.decorator';

@Controller(WORKER_ROUTES.ROOT)
export class WorkerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post(WORKER_ROUTES.ADD_WORKER)
  @Roles('admin', 'project_manager')
  async createWorker(@Body() dto: CreateWorkerDto): Promise<WorkerResponseDto> {
    return this.commandBus.execute(new CreateWorkerCommand(dto));
  }

  @Get(WORKER_ROUTES.GET_WORKERS)
  @Roles('admin', 'project_manager')
  async getWorkers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ): Promise<WorkerListResponseDto> {
    return this.queryBus.execute(
      new GetWorkersQuery(Number(page), Number(limit), role, search),
    );
  }

  @Patch(WORKER_ROUTES.EDIT_WORKER)
  @Roles('admin', 'project_manager')
  async updateWorker(
    @Param('id') id: string,
    @Body() dto: UpdateWorkerDto,
  ): Promise<WorkerResponseDto> {
    return this.commandBus.execute(new UpdateWorkerCommand(id, dto));
  }

  @Patch(WORKER_ROUTES.BLOCK_WORKER)
  @Roles('admin')
  async blockWorker(@Param('id') id: string): Promise<WorkerResponseDto> {
    return this.commandBus.execute(new BlockWorkerCommand(id));
  }

  @Patch(WORKER_ROUTES.UNBLOCK_WORKER)
  @Roles('admin')
  async unblockWorker(@Param('id') id: string): Promise<WorkerResponseDto> {
    return this.commandBus.execute(new UnblockWorkerCommand(id));
  }
}
