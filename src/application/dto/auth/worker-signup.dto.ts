import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class WorkerSignupDto {
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

  constructor(partial: Partial<WorkerSignupDto>) {
    this.email = partial.email ?? '';
    this.password = partial.password ?? '';
    this.confirmPassword = partial.confirmPassword ?? '';
  }
}
