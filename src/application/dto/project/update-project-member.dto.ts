import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsString()
  @IsNotEmpty()
  role: string;
}
