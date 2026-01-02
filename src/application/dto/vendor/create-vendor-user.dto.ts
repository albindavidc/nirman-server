import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateVendorUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @Matches(/^\d{10}$/, { message: 'Phone number must be a 10-digit number' })
  phoneNumber: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;

  @Transform(
    ({ value, obj }: { value: string; obj: CreateVendorUserDto }) =>
      value === obj.password,
  )
  get isPasswordMatch(): boolean {
    return true;
  }
}
