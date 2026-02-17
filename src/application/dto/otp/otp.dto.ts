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
}

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
