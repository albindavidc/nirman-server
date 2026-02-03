import { CreateMaterialTransactionDto } from '../../dto/material/transaction.dto';

export class UpdateMaterialStockCommand {
  constructor(
    public readonly materialId: string,
    public readonly userId: string,
    public readonly dto: CreateMaterialTransactionDto,
  ) {}
}
