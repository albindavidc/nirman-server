import { Command } from '@nestjs/cqrs';
import { ProjectPhaseDto } from '../../dto/project/phase/project-phase.dto';
import { CreateProjectPhaseDto } from '../../dto/project/phase/create-project-phase.dto';

export class CreateProjectPhaseCommand extends Command<ProjectPhaseDto> {
  constructor(public readonly dto: CreateProjectPhaseDto) {
    super();
  }
}
