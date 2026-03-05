import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';
import { AddProjectWorkerCommand } from '../../../commands/project/add-project-worker.command';
import {
  IProjectWorkerWriter,
  PROJECT_WORKER_WRITER,
} from '../../../../domain/repositories/project/project-worker.writer.interface';
import {
  IProfessionalRepository,
  PROFESSIONAL_REPOSITORY,
} from '../../../../domain/repositories/professional-repository.interface';

@CommandHandler(AddProjectWorkerCommand)
export class AddProjectWorkerHandler implements ICommandHandler<AddProjectWorkerCommand> {
  constructor(
    @Inject(PROJECT_WORKER_WRITER)
    private readonly projectWorkerRepository: IProjectWorkerWriter,
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
  ) {}

  async execute(command: AddProjectWorkerCommand): Promise<{
    message: string;
    addedCount: number;
    workers: Array<{
      userId: string;
      role: string;
      joinedAt: Date;
      isCreator: boolean;
    }>;
  }> {
    const { projectId, userIds, role } = command;

    // Verify all users are professionals
    const verifiedProfessionalIds =
      await this.professionalRepository.verifyProfessionals(userIds);

    if (verifiedProfessionalIds.length !== userIds.length) {
      throw new BadRequestException(
        'One or more users are not professionals. Only professionals can be added to projects.',
      );
    }

    // Add workers to project
    const result = await this.projectWorkerRepository.addWorkers(
      projectId,
      userIds.map((userId) => ({ userId, role })),
    );

    if (result.addedCount === 0) {
      throw new BadRequestException(
        'All selected professionals are already workers of this project.',
      );
    }

    return {
      message: `${result.addedCount} worker(s) added successfully`,
      addedCount: result.addedCount,
      workers: result.workers.map((w) => ({
        userId: w.userId,
        role: w.role,
        joinedAt: w.joinedAt,
        isCreator: w.isCreator,
      })),
    };
  }
}
