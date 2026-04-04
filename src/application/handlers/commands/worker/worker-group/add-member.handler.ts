import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddMemberCommand } from '../../../../commands/worker/worker-group/add-member.command';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../../domain/repositories/worker';
import {
  IWorkerRepository,
  WORKER_REPOSITORY,
} from '../../../../../domain/repositories/worker-repository.interface';
import { WorkerGroupEntity } from '../../../../../domain/entities/worker-group.entity';

@CommandHandler(AddMemberCommand)
export class AddMemberHandler implements ICommandHandler<AddMemberCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepo: IWorkerRepository,
  ) {}

  async execute(command: AddMemberCommand): Promise<WorkerGroupEntity> {
    const group = await this.repo.findById(command.groupId);
    if (!group) {
      throw new NotFoundException('Worker group not found');
    }

    // Resolve professional ID from user ID
    const worker = await this.workerRepo.findById(command.workerId);
    if (!worker || !worker.professional?.id) {
      throw new NotFoundException('Worker professional profile not found');
    }

    const professionalId = worker.professional.id;

    const alreadyMember = await this.repo.isMemberInGroup(
      professionalId,
      command.groupId,
    );

    if (alreadyMember) {
      throw new Error('Worker is already a member of this group');
    }

    await this.repo.addMember(command.groupId, professionalId);

    // Return the updated group
    const updatedGroup = await this.repo.findById(command.groupId);
    if (!updatedGroup) {
      throw new NotFoundException('Failed to fetch updated worker group');
    }
    return updatedGroup;
  }
}
