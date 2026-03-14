import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';
import { CreateWorkerCommand } from '../../../commands/worker/create-worker.command';
import { WorkerResponseDto } from '../../../dto/worker/worker-response.dto';
import {
  IWorkerRepository,
  WORKER_REPOSITORY,
} from '../../../../domain/repositories/worker-repository.interface';
import * as argon2 from 'argon2';

@CommandHandler(CreateWorkerCommand)
export class CreateWorkerHandler implements ICommandHandler<CreateWorkerCommand> {
  constructor(
    @Inject(WORKER_REPOSITORY)
    private readonly workerRepository: IWorkerRepository,
  ) {}

  async execute(command: CreateWorkerCommand): Promise<WorkerResponseDto> {
    const { data } = command;

    if (!data) {
      throw new Error('Worker data is undefined');
    }

    // Check if email already exists
    const existingUser = await this.workerRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Hash password - use provided or generate default
    const rawPassword = data.password || 'Temp@1234';
    const passwordHash = await argon2.hash(rawPassword);

    // Create worker with optional professional data
    const worker = await this.workerRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phone,
      passwordHash,
      role: data.role as any,
      professional: data.professionalTitle
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
