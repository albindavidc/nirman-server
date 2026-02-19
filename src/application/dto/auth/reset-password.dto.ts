import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;

  constructor(partial: Partial<ResetPasswordDto>) {
    this.email = partial.email ?? '';
    this.resetToken = partial.resetToken ?? '';
    this.newPassword = partial.newPassword ?? '';
  }
}
