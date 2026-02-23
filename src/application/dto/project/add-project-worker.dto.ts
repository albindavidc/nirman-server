import { IsArray, IsUUID, IsEnum } from 'class-validator';
import { ProjectRole } from '../../../domain/enums/project-role.enum';

export class AddProjectWorkerDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds!: string[];

  @IsEnum(ProjectRole)
  role!: ProjectRole;
}
