import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  IMaterialReader,
  MATERIAL_READER,
} from '../../../../domain/repositories/project-material/material.reader.interface';
import {
  IMaterialWriter,
  MATERIAL_WRITER,
} from '../../../../domain/repositories/project-material/material.writer.interface';
import {
  IMaterialTransactionWriter,
  MATERIAL_TRANSACTION_WRITER,
} from '../../../../domain/repositories/project-material/material-transaction.writer.interface';
import { MaterialTransaction } from '../../../../domain/entities/material-transaction.entity';
import { MaterialTransactionMapper } from '../../../mappers/material-transaction.mapper';
import { UpdateMaterialStockCommand } from '../../../commands/material/update-material-stock.command';

/**
 * DIP — injects only the three narrow interfaces it needs:
 *       IMaterialReader (guard-read), IMaterialWriter (stock update),
 *       IMaterialTransactionWriter (audit record).
 * No concrete infrastructure class import.
 */
@CommandHandler(UpdateMaterialStockCommand)
export class UpdateMaterialStockHandler implements ICommandHandler<UpdateMaterialStockCommand> {
  constructor(
    @Inject(MATERIAL_READER)
    private readonly materialReader: IMaterialReader,
    @Inject(MATERIAL_WRITER)
    private readonly materialWriter: IMaterialWriter,
    @Inject(MATERIAL_TRANSACTION_WRITER)
    private readonly transactionWriter: IMaterialTransactionWriter,
  ) {}

  async execute(command: UpdateMaterialStockCommand) {
    const { materialId, userId, dto } = command;

    const material = await this.materialReader.findById(materialId);
    if (!material) {
      throw new NotFoundException('Material not found');
    }

    material.updateStock(dto.quantity, dto.type);
    await this.materialWriter.save(material);

    const transaction = new MaterialTransaction(
      '',
      materialId,
      dto.type,
      dto.quantity,
      new Date(),
      dto.referenceId ?? null,
      userId,
      dto.notes ?? null,
    );

    const saved = await this.transactionWriter.save(transaction);
    return MaterialTransactionMapper.toDto(saved);
  }
}
