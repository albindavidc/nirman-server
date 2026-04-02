import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateWorkerGroupCommand } from '../../../../commands/worker/worker-group/update-worker-group.command';
import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../../domain/repositories/worker';
import { WorkerGroupResponseDto } from '../../../../dto/worker/worker-group/worker-group-response.dto';
import { TradeType } from '../../../../../domain/enums/trade-type.enum';
import { WorkerGroupMapper } from '../../../../mappers/worker/worker-group/worker-group.mapper';

@CommandHandler(UpdateWorkerGroupCommand)
export class UpdateWorkerGroupHandler implements ICommandHandler<UpdateWorkerGroupCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
  ) {}

  async execute(
    command: UpdateWorkerGroupCommand,
  ): Promise<WorkerGroupResponseDto> {
    const group = await this.repo.findById(command.id);
    if (!group) {
      throw new NotFoundException('Worker group not found');
    }

    if (group.projectId !== command.projectId) {
      throw new ForbiddenException(
        'You do not have permission to update this worker group',
      );
    }

    if (command.name && command.name !== group.name) {
      const nameExists = await this.repo.existsByName(
        command.name,
        command.projectId,
      );
      if (nameExists) {
        throw new Error('Worker group name already exists');
      }
    }

    const updated = await this.repo.update(command.id, {
      name: command.name,
      description: command.description,
      trade: command.trade as TradeType,
      isActive: command.isActive,
    });

    return WorkerGroupMapper.toResponse(updated);
  }
}
