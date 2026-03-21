import { Command } from '@nestjs/cqrs';
import { MaterialTransactionDto } from '../../dto/material/transaction.dto';
import { CreateMaterialTransactionDto } from '../../dto/material/transaction.dto';

export class UpdateMaterialStockCommand extends Command<MaterialTransactionDto> {
  constructor(
    public readonly materialId: string,
    public readonly userId: string,
    public readonly dto: CreateMaterialTransactionDto,
  ) {
    super();
  }
}
