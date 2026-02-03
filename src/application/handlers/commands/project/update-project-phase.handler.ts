import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { UpdateProjectPhaseCommand } from '../../../commands/project/update-project-phase.command';
import { ProjectPhaseDto } from '../../../dto/project/phase/project-phase.dto';
import { ProjectPhaseMapper } from '../../../mappers/project-phase.mapper';
import {
  IProjectPhaseRepository,
  PROJECT_PHASE_REPOSITORY,
} from '../../../../domain/repositories/project-phase-repository.interface';

@CommandHandler(UpdateProjectPhaseCommand)
export class UpdateProjectPhaseHandler implements ICommandHandler<UpdateProjectPhaseCommand> {
  constructor(
    @Inject(PROJECT_PHASE_REPOSITORY)
    private readonly projectPhaseRepository: IProjectPhaseRepository,
  ) {}

  async execute(command: UpdateProjectPhaseCommand): Promise<ProjectPhaseDto> {
    const { phaseId, data } = command;

    const updatedPhase = await this.projectPhaseRepository.update(phaseId, {
      name: data.name,
      description: data.description,
      progress: data.progress,
      status: data.status,
      sequence: data.sequence,
      plannedStartDate: data.plannedStartDate
        ? new Date(data.plannedStartDate)
        : undefined,
      plannedEndDate: data.plannedEndDate
        ? new Date(data.plannedEndDate)
        : undefined,
      actualStartDate: data.actualStartDate
        ? new Date(data.actualStartDate)
        : undefined,
      actualEndDate: data.actualEndDate
        ? new Date(data.actualEndDate)
        : undefined,
    });

    return ProjectPhaseMapper.toDto(updatedPhase);
  }
}
