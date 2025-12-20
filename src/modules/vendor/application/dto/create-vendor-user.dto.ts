import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateVendorUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
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
