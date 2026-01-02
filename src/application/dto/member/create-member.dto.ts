import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  IsArray,
  MinLength,
  Min,
} from 'class-validator';

export enum MemberRole {
  WORKER = 'worker',
  SUPERVISOR = 'supervisor',
}

export class CreateMemberDto {
  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string; // Front-end sends 'phone', not 'phoneNumber'

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string; // Optional - will generate default if not provided

  @IsString()
  role: string; // Accept any role string (worker, supervisor, professional)

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
