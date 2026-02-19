import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum VendorStatusDto {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BLACKLISTED = 'blacklisted',
}

export class GetVendorsQueryDto {
  @IsOptional()
  @IsEnum(VendorStatusDto)
  status?: VendorStatusDto;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: string }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }: { value: string }) => parseInt(value))
  limit?: number = 10;

  constructor(partial: Partial<GetVendorsQueryDto>) {
    this.status = partial.status;
    this.search = partial.search;
    this.page = partial.page ?? 1;
    this.limit = partial.limit ?? 10;
  }
}
