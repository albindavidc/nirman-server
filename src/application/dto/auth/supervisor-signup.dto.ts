import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SupervisorSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  constructor(partial: Partial<SupervisorSignupDto>) {
    this.email = partial.email ?? '';
    this.password = partial.password ?? '';
    this.confirmPassword = partial.confirmPassword ?? '';
  }
}
