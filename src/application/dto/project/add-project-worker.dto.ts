import { ArrayNotEmpty, IsArray, IsEnum } from 'class-validator';
import { ProjectRole } from '../../../domain/enums/project-role.enum';

export class AddProjectWorkerDto {
  // allow passing a single UUID or an array, then always transform to array
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     return [value];
  //   }
  //   return value;
  // })
  @IsArray()
  @ArrayNotEmpty()
  // @IsUUID('4', { each: true })
  userIds!: string[];

  // accept role in any case and normalise to enum value
  // @Transform(({ value }) => {
  //   if (typeof value === 'string') {
  //     const formatted =
  //       value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  //     return formatted;
  //   }
  //   return value;
  // })
  @IsEnum(ProjectRole)
  role!: ProjectRole;
}
