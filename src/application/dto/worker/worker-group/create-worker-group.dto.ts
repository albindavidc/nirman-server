import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TradeType } from '../../../../domain/enums/trade-type.enum';

export class CreateWorkerGroupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(TradeType)
  trade!: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  workerIds?: string[];
}
