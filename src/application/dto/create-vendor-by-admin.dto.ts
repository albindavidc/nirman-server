import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { VendorStatus } from 'src/generated/client/enums';

export class CreateVendorByAdminDto {
  // User Details
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  phone: string;

  // Vendor Details
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  registrationNumber: string;

  @IsOptional()
  taxNumber?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsInBusiness?: number;

  @IsNotEmpty()
  addressStreet: string;

  @IsOptional()
  addressCity?: string;

  @IsOptional()
  addressState?: string;

  @IsOptional()
  addressZipCode?: string;

  @IsArray()
  @IsOptional()
  productsServices?: string[];

  @IsOptional()
  websiteUrl?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  contactPhone?: string;

  @IsOptional()
  vendorStatus?: VendorStatus;
}
