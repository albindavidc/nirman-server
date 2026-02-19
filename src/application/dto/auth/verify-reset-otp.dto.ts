import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyResetOtpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;

  constructor(partial: Partial<VerifyResetOtpDto>) {
    this.email = partial.email ?? '';
    this.otp = partial.otp ?? '';
  }
}

export class VerifyResetOtpResponseDto {
  resetToken: string;
  message: string;

  constructor(partial: Partial<VerifyResetOtpResponseDto>) {
    this.resetToken = partial.resetToken ?? '';
    this.message = partial.message ?? '';
  }
}
