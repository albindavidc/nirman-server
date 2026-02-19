import {
  IsArray,
  IsEmail,
  IsInt,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { VendorStatus } from '../../../domain/enums/vendor-status.enum';

export class CreateVendorByAdminDto {
  // User Details
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

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
  @IsEnum(VendorStatus)
  vendorStatus?: VendorStatus;

  constructor(partial: Partial<CreateVendorByAdminDto>) {
    this.email = partial.email ?? '';
    this.password = partial.password ?? '';
    this.firstName = partial.firstName ?? '';
    this.lastName = partial.lastName ?? '';
    this.phone = partial.phone ?? '';
    this.companyName = partial.companyName ?? '';
    this.registrationNumber = partial.registrationNumber ?? '';
    this.taxNumber = partial.taxNumber;
    this.yearsInBusiness = partial.yearsInBusiness;
    this.addressStreet = partial.addressStreet ?? '';
    this.addressCity = partial.addressCity;
    this.addressState = partial.addressState;
    this.addressZipCode = partial.addressZipCode;
    this.productsServices = partial.productsServices;
    this.websiteUrl = partial.websiteUrl;
    this.contactEmail = partial.contactEmail;
    this.contactPhone = partial.contactPhone;
    this.vendorStatus = partial.vendorStatus;
  }
}
