import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  // Basic phone validation or just string
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  profilePhotoUrl?: string;

  constructor(partial: Partial<UpdateProfileDto>) {
    this.firstName = partial.firstName;
    this.lastName = partial.lastName;
    this.phoneNumber = partial.phoneNumber;
    this.profilePhotoUrl = partial.profilePhotoUrl;
  }
}
