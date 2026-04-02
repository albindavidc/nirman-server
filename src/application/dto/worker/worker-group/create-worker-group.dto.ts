import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { TradeType } from '../../../../domain/enums/trade-type.enum';

export class CreateWorkerGroupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUUID()
  projectId!: string;

  @IsEnum(TradeType)
  trade!: string;
}
