import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddMemberCommand } from '../../../../commands/worker/worker-group/add-member.command';
import { Inject } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../../domain/repositories/worker';

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
  ) {}

  async execute(command: AddMemberCommand): Promise<void> {
    const group = await this.repo.findById(command.groupId);
    if (!group) {
      throw new Error('Worker group not found');
    }

    if (group.projectId !== command.projectId) {
      throw new Error(
        'You do not have permission to add members to this worker group',
      );
    }

    const alreadyMember = await this.repo.isMemberInGroup(
      command.groupId,
      command.workerId,
    );
    if (alreadyMember) {
      throw new Error('Worker is already a member of this group');
    }

    const member = await this.repo.addMember(command.groupId, command.workerId);
    return member;
  }
}
