import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  role?: string; // Using string to avoid strict enum validation issues at DTO level for now, or import Role

  @IsOptional()
  isSignup?: boolean;

  constructor(partial: Partial<SendOtpDto>) {
    this.email = partial.email ?? '';
    this.role = partial.role;
    this.isSignup = partial.isSignup;
  }
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

  constructor(partial: Partial<VerifyOtpDto>) {
    this.email = partial.email ?? '';
    this.otp = partial.otp ?? '';
  }
}
