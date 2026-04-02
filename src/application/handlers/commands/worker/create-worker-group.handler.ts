import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWorkerGroupCommand } from '../../../commands/worker/create-worker-group.command';
import { Inject } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../domain/repositories/worker';
import { WorkerGroupResponseDto } from '../../../dto/worker/worker-group/worker-group-response.dto';
import { WorkerGroupEntity } from '../../../../domain/entities/worker-group.entity';
import { WorkerGroupMapper } from '../../../mappers/worker/worker-group/worker-group.mapper';

@CommandHandler(CreateWorkerGroupCommand)
export class CreateWorkerGroupHandler implements ICommandHandler<CreateWorkerGroupCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
  ) {}

  async execute(
    command: CreateWorkerGroupCommand,
  ): Promise<WorkerGroupResponseDto> {
    const nameExists = await this.repo.existsByName(
      command.name,
      command.projectId,
    );
    if (nameExists) {
      throw new Error('Worker group name already exists');
    }

    const entity = await this.repo.create({
      name: command.name,
      description: command.description,
      trade: command.trade,
      projectId: command.projectId,
      createdById: command.createdById,
      isActive: true,
    });

    return WorkerGroupMapper.toResponse(entity);
  }
}
