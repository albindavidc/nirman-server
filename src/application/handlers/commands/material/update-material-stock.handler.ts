import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MaterialRepository } from '../../../../infrastructure/repositories/material.repository';
import { MaterialTransactionRepository } from '../../../../infrastructure/repositories/material-transaction.repository';
import { MaterialTransaction } from '../../../../domain/entities/material-transaction.entity';
import { MaterialTransactionMapper } from '../../../mappers/material-transaction.mapper';

import { UpdateMaterialStockCommand } from '../../../commands/material/update-material-stock.command';

@CommandHandler(UpdateMaterialStockCommand)
export class UpdateMaterialStockHandler implements ICommandHandler<UpdateMaterialStockCommand> {
  constructor(
    private readonly materialRepository: MaterialRepository,
    private readonly transactionRepository: MaterialTransactionRepository,
  ) {}

  async execute(command: UpdateMaterialStockCommand) {
    const { materialId, userId, dto } = command;

    const material = await this.materialRepository.findById(materialId);
    if (!material) {
      throw new Error('Material not found');
    }

    // Update stock using domain entity method
    material.updateStock(dto.quantity, dto.type);

    // Status update logic
    if (material.currentStock === 0) {
      material.status = 'out_of_stock';
    } else if (
      material.reorderLevel &&
      material.currentStock <= material.reorderLevel
    ) {
      material.status = 'low_stock';
    } else {
      material.status = 'in_stock';
    }

    await this.materialRepository.update(material);

    // Create transaction record
    const transaction = new MaterialTransaction(
      '', // ID
      materialId,
      dto.type,
      dto.quantity,
      new Date(), // date
      dto.referenceId ?? null,
      userId, // performedBy
      dto.notes ?? null,
    );

    const savedTransaction =
      await this.transactionRepository.create(transaction);
    return MaterialTransactionMapper.toDto(savedTransaction);
  }
}
