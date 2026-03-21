import { Command } from '@nestjs/cqrs';
import { ProjectResponseDto } from '../../dto/project/project-response.dto';
import { UpdateProjectDto } from '../../dto/project/update-project.dto';

export class UpdateProjectCommand extends Command<ProjectResponseDto> {
  constructor(
    public readonly projectId: string,
    public readonly data: UpdateProjectDto,
  ) {
    super();
  }
}
