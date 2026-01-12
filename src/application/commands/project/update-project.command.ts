import { UpdateProjectDto } from '../../dto/project/update-project.dto';

export class UpdateProjectCommand {
  constructor(
    public readonly projectId: string,
    public readonly data: UpdateProjectDto,
  ) {}
}
