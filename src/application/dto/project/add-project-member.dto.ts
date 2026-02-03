import { IsArray, IsString, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class AddProjectMemberDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  userIds: string[];

  @IsString()
  @IsNotEmpty()
  role: string;
}
