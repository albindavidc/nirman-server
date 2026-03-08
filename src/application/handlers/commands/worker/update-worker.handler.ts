import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateWorkerCommand } from '../../../commands/worker/update-worker.command';
import { WorkerResponseDto } from '../../../dto/worker/worker-response.dto';
import {
  IWorkerRepository,
  WORKER_REPOSITORY,
} from '../../../../domain/repositories/worker-repository.interface';

@CommandHandler(UpdateWorkerCommand)
export class UpdateWorkerHandler implements ICommandHandler<UpdateWorkerCommand> {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async execute(command: UpdateWorkerCommand): Promise<WorkerResponseDto> {
    const { id, data } = command;

    // Check if worker exists
    const existingWorker = await this.workerRepository.findById(id);

    if (!existingWorker) {
      throw new NotFoundException('Worker not found');
    }

    // Build professional data if any professional fields are provided
    const hasProfessionalData =
      data.professionalTitle !== undefined ||
      data.experienceYears !== undefined ||
      data.skills !== undefined ||
      data.addressStreet !== undefined ||
      data.addressCity !== undefined ||
      data.addressState !== undefined ||
      data.addressZipCode !== undefined;

    // Update worker
    const updatedWorker = await this.workerRepository.update(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phone,
      role: data.role as any,
      professional: hasProfessionalData
        ? {
            professionalTitle: data.professionalTitle,
            experienceYears: data.experienceYears,
            skills: data.skills,
            addressStreet: data.addressStreet,
            addressCity: data.addressCity,
            addressState: data.addressState,
            addressZipCode: data.addressZipCode,
          }
        : undefined,
    });

    return {
      id: updatedWorker.id,
      firstName: updatedWorker.firstName,
      lastName: updatedWorker.lastName,
      email: updatedWorker.email,
      phoneNumber: updatedWorker.phoneNumber ?? undefined,
      role: updatedWorker.role,
      userStatus: updatedWorker.userStatus,
      professionalTitle: updatedWorker.professional?.professionalTitle,
      experienceYears: updatedWorker.professional?.experienceYears,
      skills: updatedWorker.professional?.skills,
      addressStreet: updatedWorker.professional?.addressStreet,
      addressCity: updatedWorker.professional?.addressCity,
      addressState: updatedWorker.professional?.addressState,
      addressZipCode: updatedWorker.professional?.addressZipCode,
      createdAt: updatedWorker.createdAt,
      updatedAt: updatedWorker.updatedAt,
    };
  }
}
