import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateProjectPhaseCommand } from '../../../commands/project/update-project-phase.command';
import { ProjectPhaseDto } from '../../../dto/project/phase/project-phase.dto';
import { ProjectPhaseMapper } from '../../../mappers/project-phase.mapper';
import { PROJECT_PHASE_REPOSITORY } from '../../../../domain/repositories/project-phase/project-phase-repository.interface';
import { PROJECT_PHASE_QUERY_REPOSITORY } from '../../../../domain/repositories/project-phase/project-phase.query-reader.interface';
import { IProjectPhaseReader } from '../../../../domain/repositories/project-phase/project-phase.reader.interface';
import { IProjectPhaseWriter } from '../../../../domain/repositories/project-phase/project-phase.writer.interface';

@CommandHandler(UpdateProjectPhaseCommand)
export class UpdateProjectPhaseHandler implements ICommandHandler<UpdateProjectPhaseCommand> {
  constructor(
    @Inject(PROJECT_PHASE_REPOSITORY)
    private readonly projectPhaseWriter: IProjectPhaseWriter,
    @Inject(PROJECT_PHASE_QUERY_REPOSITORY)
    private readonly projectPhaseReader: IProjectPhaseReader,
  ) {}

  async execute(command: UpdateProjectPhaseCommand): Promise<ProjectPhaseDto> {
    const { phaseId, data } = command;

    const phase = await this.projectPhaseReader.findById(phaseId);
    if (!phase) {
      throw new NotFoundException('Project phase not found');
    }

    if (data.name || data.description || data.sequence !== undefined) {
      phase.updateDetails(
        data.name ?? phase.name,
        data.description ?? phase.description,
        data.sequence ?? phase.sequence,
      );
    }

    if (data.progress !== undefined) {
      phase.updateProgress(data.progress);
    }

    if (data.status) {
      phase.updateStatus(data.status);
    }

    const plannedStart = data.plannedStartDate
      ? new Date(data.plannedStartDate)
      : phase.plannedStartDate;
    const plannedEnd = data.plannedEndDate
      ? new Date(data.plannedEndDate)
      : phase.plannedEndDate;
    if (data.plannedStartDate || data.plannedEndDate) {
      phase.updatePlannedDates(plannedStart, plannedEnd);
    }

    const actualStart = data.actualStartDate
      ? new Date(data.actualStartDate)
      : phase.actualStartDate;
    const actualEnd = data.actualEndDate
      ? new Date(data.actualEndDate)
      : phase.actualEndDate;
    if (data.actualStartDate || data.actualEndDate) {
      phase.updateActualDates(actualStart, actualEnd);
    }

    if (data.workerGroupIds) {
      phase.setWorkerGroupIds(data.workerGroupIds);
    }

    const updatedPhase = await this.projectPhaseWriter.save(phase);

    return ProjectPhaseMapper.toDto(updatedPhase);
  }
}
