import { CreateProjectPhaseDto } from '../../dto/project/phase/create-project-phase.dto';

export class CreateProjectPhaseCommand {
  constructor(public readonly dto: CreateProjectPhaseDto) {}
}
