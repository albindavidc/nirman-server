import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateWorkerGroupCommand } from '../../../../commands/worker/worker-group/create-worker-group.command';
import { Inject } from '@nestjs/common';
import {
  IWorkerGroupRepository,
  WORKER_GROUP_REPOSITORY,
} from '../../../../../domain/repositories/worker';
import {
  IWorkerRepository,
  WORKER_REPOSITORY,
} from '../../../../../domain/repositories/worker-repository.interface';
import { WorkerGroupResponseDto } from '../../../../dto/worker/worker-group/worker-group-response.dto';
import { WorkerGroupMapper } from '../../../../mappers/worker/worker-group/worker-group.mapper';

@CommandHandler(CreateWorkerGroupCommand)
export class CreateWorkerGroupHandler implements ICommandHandler<CreateWorkerGroupCommand> {
  constructor(
    @Inject(WORKER_GROUP_REPOSITORY)
    private readonly repo: IWorkerGroupRepository,
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepo: IWorkerRepository,
  ) {}

  async execute(
    command: CreateWorkerGroupCommand,
  ): Promise<WorkerGroupResponseDto> {
    const nameExists = await this.repo.existsByName(
      command.name,
    );
    if (nameExists) {
      throw new Error('Worker group name already exists');
    }

    const entity = await this.repo.create({
      name: command.name,
      description: command.description,
      trade: command.trade,
      createdById: command.createdById,
      isActive: true,
    });

    // Add members if provided
    if (command.workerIds?.length > 0) {
      // Resolve professional IDs from user IDs
      const workers = await Promise.all(
        command.workerIds.map((userId) => this.workerRepo.findById(userId)),
      );

      const addMemberPromises = workers
        .filter((w) => w && w.professional?.id)
        .map((worker) =>
          this.repo.addMember(entity.id, worker!.professional!.id),
        );

      if (addMemberPromises.length > 0) {
        await Promise.all(addMemberPromises);
      }
    }

    return WorkerGroupMapper.toResponse(entity);
  }
}
