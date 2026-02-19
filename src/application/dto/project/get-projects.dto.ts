import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProjectsQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  constructor(partial: Partial<GetProjectsQueryDto>) {
    this.status = partial.status;
    this.search = partial.search;
    this.page = partial.page ?? 1;
    this.limit = partial.limit ?? 10;
  }
}
