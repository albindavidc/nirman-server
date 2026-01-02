import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsArray,
  MinLength,
  Min,
} from 'class-validator';

export class UpdateMemberDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string; // Front-end sends 'phone'

  @IsOptional()
  @IsString()
  role?: string;

  // Professional fields
  @IsOptional()
  @IsString()
  professionalTitle?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

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
}
