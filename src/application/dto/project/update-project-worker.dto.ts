import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { ProjectRole } from '../../../domain/enums/project-role.enum';

export class UpdateProjectWorkerDto {
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const formatted =
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
      return formatted;
    }
    return value;
  })
  @IsEnum(ProjectRole)
  role!: ProjectRole;
}
