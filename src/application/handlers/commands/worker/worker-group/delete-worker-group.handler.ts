import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteWorkerGroupCommand } from '../../../../commands/worker/worker-group/delete-worker-group.command';
import { Inject } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../../domain/repositories/worker';
import { WorkerGroupResponseDto } from '../../../../dto/worker/worker-group/worker-group-response.dto';
import { WorkerGroupMapper } from '../../../../mappers/worker/worker-group/worker-group.mapper';

@CommandHandler(DeleteWorkerGroupCommand)
export class DeleteWorkerGroupHandler implements ICommandHandler<DeleteWorkerGroupCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
  ) {}

  async execute(command: DeleteWorkerGroupCommand): Promise<void> {
    const group = await this.repo.findById(command.id);
    if (!group) {
      throw new Error('Worker group not found');
    }

    if (group.projectId !== command.projectId) {
      throw new Error('You do not have permission to delete this worker group');
    }

    await this.repo.softDelete(command.id);
  }
}
