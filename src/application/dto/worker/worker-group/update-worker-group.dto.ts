import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { TradeType } from '../../../../domain/enums/trade-type.enum';

export class UpdateWorkerGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TradeType)
  trade?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
