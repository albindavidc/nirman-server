import { CreateProjectDto } from '../../dto/project/create-project.dto';

export class CreateProjectCommand {
  constructor(
    public readonly data: CreateProjectDto,
    public readonly createdBy: string,
  ) {}
}
