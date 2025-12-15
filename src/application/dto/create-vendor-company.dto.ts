import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateVendorUserDto {
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  registrationNumber: string;

  @IsNotEmpty()
  taxNumber: string;

  @IsInt()
  @Min(0)
  yearsInBusiness: number;

  @IsNotEmpty()
  addressStreet: string;

  @IsNotEmpty()
  addressCity: string;

  @IsNotEmpty()
  addressState: string;

  @IsNotEmpty()
  addressZipCode: string;

  @IsArray()
  @IsOptional()
  productsServices: string[];

  @IsOptional()
  websiteUrl: string;

  @IsOptional()
  @IsEmail()
  contactEmail: string;

  @IsOptional()
  contactPhone: string;
}
