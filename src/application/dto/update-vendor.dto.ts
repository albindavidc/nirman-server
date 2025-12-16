import {
  IsOptional,
  IsString,
  IsEmail,
  IsEnum,
  MinLength,
} from 'class-validator';

export enum VendorStatusDto {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BLACKLISTED = 'blacklisted',
}

export class UpdateVendorDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  companyName?: string;

  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;

  @IsOptional()
  @IsString()
  addressStreet?: string;

  @IsOptional()
  @IsString()
  addressCity?: string;

  @IsOptional()
  @IsString()
  addressState?: string;

  @IsOptional()
  @IsString()
  addressZipCode?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  websiteUrl?: string;

  @IsOptional()
  @IsEnum(VendorStatusDto)
  vendorStatus?: VendorStatusDto;
}
