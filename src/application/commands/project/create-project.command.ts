import { Command } from '@nestjs/cqrs';
import { ProjectResponseDto } from '../../dto/project/project-response.dto';
import { CreateProjectDto } from '../../dto/project/create-project.dto';

export class CreateProjectCommand extends Command<ProjectResponseDto> {
  constructor(
    public readonly data: CreateProjectDto,
    public readonly createdBy: string,
  ) {
    super();
  }
}
