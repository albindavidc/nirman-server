import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  constructor(partial: Partial<UpdatePasswordDto>) {
    this.currentPassword = partial.currentPassword ?? '';
    this.newPassword = partial.newPassword ?? '';
  }
}
