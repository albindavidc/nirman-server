import { IsEnum } from 'class-validator';
import { ProjectRole } from '../../../domain/enums/project-role.enum';

export class UpdateProjectWorkerDto {
  @IsEnum(ProjectRole)
  role!: ProjectRole;
}
