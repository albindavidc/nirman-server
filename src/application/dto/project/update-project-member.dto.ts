import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProjectMemberDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  constructor(partial: Partial<UpdateProjectMemberDto>) {
    this.role = partial.role ?? '';
  }
}
