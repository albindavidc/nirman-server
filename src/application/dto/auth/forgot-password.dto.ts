import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  constructor(partial: Partial<ForgotPasswordDto>) {
    this.email = partial.email ?? '';
  }
}
