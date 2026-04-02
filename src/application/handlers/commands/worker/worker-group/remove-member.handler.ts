import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveMemberCommand } from '../../../../commands/worker/worker-group/remove-member.command';
import { Inject } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../../domain/repositories/worker';

@CommandHandler(RemoveMemberCommand)
export class RemoveMemberHandler implements ICommandHandler<RemoveMemberCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
  ) {}

  async execute(command: RemoveMemberCommand): Promise<void> {
    const group = await this.repo.findById(command.groupId);
    if (!group) {
      throw new Error('Worker group not found');
    }

    if (group.projectId !== command.projectId) {
      throw new Error(
        'You do not have permission to remove members from this worker group',
      );
    }

    const isWorker = await this.repo.isMemberInGroup(
      command.groupId,
      command.workerId,
    );
    if (!isWorker) {
      throw new Error('Worker is not a member of this group');
    }

    const member = await this.repo.removeMember(
      command.groupId,
      command.workerId,
    );
    return member;
  }
}
