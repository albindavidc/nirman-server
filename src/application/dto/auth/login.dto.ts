import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  constructor(partial: Partial<LoginDto>) {
    this.email = partial.email ?? '';
    this.password = partial.password ?? '';
  }
}

export class LoginResponseDto {
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };

  constructor(partial: Partial<LoginResponseDto>) {
    this.accessToken = partial.accessToken ?? '';
    this.user = partial.user ?? {
      id: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
    };
  }
}
