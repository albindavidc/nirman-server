import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteWorkerGroupCommand } from '../../../../commands/worker/worker-group/delete-worker-group.command';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../../domain/repositories/worker';

@CommandHandler(DeleteWorkerGroupCommand)
export class DeleteWorkerGroupHandler implements ICommandHandler<DeleteWorkerGroupCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
  ) {}

  async execute(command: DeleteWorkerGroupCommand): Promise<void> {
    const group = await this.repo.findById(command.id);
    if (!group) {
      throw new NotFoundException('Worker group not found');
    }

    await this.repo.softDelete(command.id);
  }
}
