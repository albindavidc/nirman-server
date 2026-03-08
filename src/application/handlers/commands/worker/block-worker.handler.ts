import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  BlockWorkerCommand,
  UnblockWorkerCommand,
} from '../../../commands/worker/block-worker.command';
import { WorkerResponseDto } from '../../../dto/worker/worker-response.dto';
import {
  IWorkerRepository,
  WORKER_REPOSITORY,
} from '../../../../domain/repositories/worker-repository.interface';
import { UserStatus } from '../../../../domain/enums/user-status.enum';

@CommandHandler(BlockWorkerCommand)
export class BlockWorkerHandler implements ICommandHandler<BlockWorkerCommand> {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async execute(command: BlockWorkerCommand): Promise<WorkerResponseDto> {
    const { id } = command;

    // Check if worker exists
    const existingWorker = await this.workerRepository.findById(id);

    if (!existingWorker) {
      throw new NotFoundException('Worker not found');
    }

    // Update status to blocked
    const worker = await this.workerRepository.updateStatus(id, UserStatus.BLOCKED);

    return {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      email: worker.email,
      phoneNumber: worker.phoneNumber ?? undefined,
      role: worker.role,
      userStatus: worker.userStatus,
      professionalTitle: worker.professional?.professionalTitle,
      experienceYears: worker.professional?.experienceYears,
      skills: worker.professional?.skills,
      addressStreet: worker.professional?.addressStreet,
      addressCity: worker.professional?.addressCity,
      addressState: worker.professional?.addressState,
      addressZipCode: worker.professional?.addressZipCode,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
    };
  }
}

@CommandHandler(UnblockWorkerCommand)
export class UnblockWorkerHandler implements ICommandHandler<UnblockWorkerCommand> {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async execute(command: UnblockWorkerCommand): Promise<WorkerResponseDto> {
    const { id } = command;

    // Check if worker exists
    const existingWorker = await this.workerRepository.findById(id);

    if (!existingWorker) {
      throw new NotFoundException('Worker not found');
    }

    // Update status to active
    const worker = await this.workerRepository.updateStatus(id, UserStatus.ACTIVE);

    return {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      email: worker.email,
      phoneNumber: worker.phoneNumber ?? undefined,
      role: worker.role,
      userStatus: worker.userStatus,
      professionalTitle: worker.professional?.professionalTitle,
      experienceYears: worker.professional?.experienceYears,
      skills: worker.professional?.skills,
      addressStreet: worker.professional?.addressStreet,
      addressCity: worker.professional?.addressCity,
      addressState: worker.professional?.addressState,
      addressZipCode: worker.professional?.addressZipCode,
      createdAt: worker.createdAt,
      updatedAt: worker.updatedAt,
    };
  }
}
