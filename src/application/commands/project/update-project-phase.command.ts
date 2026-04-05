import { Command } from '@nestjs/cqrs';
import { ProjectPhaseDto } from '../../dto/project/phase/project-phase.dto';

export class UpdateProjectPhaseCommand extends Command<ProjectPhaseDto> {
  constructor(
    public readonly phaseId: string,
    public readonly data: {
      name?: string;
      description?: string;
      progress?: number;
      status?: string;
      plannedStartDate?: string;
      plannedEndDate?: string;
      actualStartDate?: string;
      actualEndDate?: string;
      sequence?: number;
      workerGroupIds?: string[];
    },
  ) {
    super();
  }
}
